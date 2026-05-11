package live.dilmith.crypticbrain.backend.service.impl;

import live.dilmith.crypticbrain.backend.dto.booking.BookingCancelRequest;
import live.dilmith.crypticbrain.backend.dto.booking.BookingCreateRequest;
import live.dilmith.crypticbrain.backend.dto.booking.BookingResponse;
import live.dilmith.crypticbrain.backend.dto.room.RoomResponse;
import live.dilmith.crypticbrain.backend.dto.user.UserResponse;
import live.dilmith.crypticbrain.backend.entity.Booking;
import live.dilmith.crypticbrain.backend.entity.Room;
import live.dilmith.crypticbrain.backend.entity.User;
import live.dilmith.crypticbrain.backend.enums.BookingStatus;
import live.dilmith.crypticbrain.backend.enums.RoomStatus;
import live.dilmith.crypticbrain.backend.exception.ConflictException;
import live.dilmith.crypticbrain.backend.exception.ResourceNotFoundException;
import live.dilmith.crypticbrain.backend.repository.BookingRepository;
import live.dilmith.crypticbrain.backend.repository.RoomRepository;
import live.dilmith.crypticbrain.backend.service.AuditLogService;
import live.dilmith.crypticbrain.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final AuditLogService auditLogService;

    @Override
    public List<BookingResponse> getAllBookings(BookingStatus status, Long roomId, String guestEmail) {
        List<Booking> bookings;

        if (status != null) {
            bookings = bookingRepository.findByStatus(status);
        } else if (roomId != null) {
            bookings = bookingRepository.findByRoom_Id(roomId);
        } else if (guestEmail != null && !guestEmail.isBlank()) {
            bookings = bookingRepository.findByGuestEmailContainingIgnoreCase(guestEmail);
        } else {
            bookings = bookingRepository.findAll();
        }

        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request, User bookedBy) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        Room room = roomRepository.findByIdWithLock(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + request.getRoomId()));

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.getRoomId(), request.getCheckInDate(), request.getCheckOutDate()
        );
        if (!overlapping.isEmpty()) {
            throw new ConflictException("Room is already booked for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = Booking.builder()
                .guestName(request.getGuestName())
                .guestEmail(request.getGuestEmail())
                .guestPhone(request.getGuestPhone())
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .status(BookingStatus.CONFIRMED)
                .totalPrice(totalPrice)
                .bookedBy(bookedBy)
                .build();

        booking = bookingRepository.save(booking);

        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        auditLogService.log("BOOKING_CREATED", "Booking", booking.getId(), bookedBy,
                "Booking created for guest: " + request.getGuestName() + ", room: " + room.getRoomNumber());

        log.info("Booking created: id={}, room={}, guest={}", booking.getId(), room.getRoomNumber(), request.getGuestName());
        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id, BookingCancelRequest request, User cancelledBy) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ConflictException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.CHECKED_OUT) {
            throw new ConflictException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledBy(cancelledBy);
        booking.setCancellationReason(request.getCancellationReason());

        Room room = booking.getRoom();
        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);

        booking = bookingRepository.save(booking);

        auditLogService.log("BOOKING_CANCELLED", "Booking", id, cancelledBy,
                "Booking cancelled. Reason: " + request.getCancellationReason() + ", room: " + room.getRoomNumber());

        log.info("Booking cancelled: id={}", id);
        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse checkIn(Long id, User performer) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new ConflictException("Booking must be in CONFIRMED status to check in. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CHECKED_IN);

        Room room = booking.getRoom();
        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        booking = bookingRepository.save(booking);

        auditLogService.log("GUEST_CHECKED_IN", "Booking", id, performer,
                "Guest checked in: " + booking.getGuestName() + ", room: " + room.getRoomNumber());

        log.info("Guest checked in: bookingId={}, room={}", id, room.getRoomNumber());
        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse checkOut(Long id, User performer) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new ConflictException("Booking must be in CHECKED_IN status to check out. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CHECKED_OUT);

        Room room = booking.getRoom();
        room.setStatus(RoomStatus.CLEANING);
        roomRepository.save(room);

        booking = bookingRepository.save(booking);

        auditLogService.log("GUEST_CHECKED_OUT", "Booking", id, performer,
                "Guest checked out: " + booking.getGuestName() + ", room: " + room.getRoomNumber());

        log.info("Guest checked out: bookingId={}, room={}", id, room.getRoomNumber());
        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .guestName(booking.getGuestName())
                .guestEmail(booking.getGuestEmail())
                .guestPhone(booking.getGuestPhone())
                .room(mapRoomToResponse(booking.getRoom()))
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .bookedBy(mapUserToResponse(booking.getBookedBy()))
                .cancelledBy(mapUserToResponse(booking.getCancelledBy()))
                .cancellationReason(booking.getCancellationReason())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    private RoomResponse mapRoomToResponse(Room room) {
        if (room == null) return null;
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .floor(room.getFloor())
                .capacity(room.getCapacity())
                .pricePerNight(room.getPricePerNight())
                .status(room.getStatus())
                .description(room.getDescription())
                .amenities(room.getAmenities())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }

    private UserResponse mapUserToResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
