package live.dilmith.crypticbrain.backend.service.impl;

import live.dilmith.crypticbrain.backend.dto.room.RoomCreateRequest;
import live.dilmith.crypticbrain.backend.dto.room.RoomResponse;
import live.dilmith.crypticbrain.backend.dto.room.RoomUpdateRequest;
import live.dilmith.crypticbrain.backend.entity.Booking;
import live.dilmith.crypticbrain.backend.entity.Room;
import live.dilmith.crypticbrain.backend.entity.User;
import live.dilmith.crypticbrain.backend.enums.BookingStatus;
import live.dilmith.crypticbrain.backend.enums.RoomStatus;
import live.dilmith.crypticbrain.backend.enums.RoomType;
import live.dilmith.crypticbrain.backend.exception.ConflictException;
import live.dilmith.crypticbrain.backend.exception.ResourceNotFoundException;
import live.dilmith.crypticbrain.backend.repository.BookingRepository;
import live.dilmith.crypticbrain.backend.repository.RoomRepository;
import live.dilmith.crypticbrain.backend.service.AuditLogService;
import live.dilmith.crypticbrain.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final AuditLogService auditLogService;

    @Override
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return mapToResponse(room);
    }

    @Override
    public List<RoomResponse> getAvailableRooms(RoomType type, Integer floor, Integer capacity, LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRooms(type, floor, capacity, checkIn, checkOut)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse createRoom(RoomCreateRequest request, User performer) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new ConflictException("Room already exists with number: " + request.getRoomNumber());
        }

        RoomStatus status = request.getStatus() != null ? request.getStatus() : RoomStatus.AVAILABLE;

        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .roomType(request.getRoomType())
                .floor(request.getFloor())
                .capacity(request.getCapacity())
                .pricePerNight(request.getPricePerNight())
                .status(status)
                .description(request.getDescription())
                .amenities(request.getAmenities())
                .build();

        room = roomRepository.save(room);

        auditLogService.log("ROOM_CREATED", "Room", room.getId(), performer,
                "Room created: " + room.getRoomNumber() + ", type: " + room.getRoomType());

        log.info("Room created: {}", room.getRoomNumber());
        return mapToResponse(room);
    }

    @Override
    public RoomResponse updateRoom(Long id, RoomUpdateRequest request, User performer) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        RoomStatus oldStatus = room.getStatus();

        if (request.getRoomNumber() != null) {
            if (!request.getRoomNumber().equals(room.getRoomNumber()) &&
                    roomRepository.existsByRoomNumber(request.getRoomNumber())) {
                throw new ConflictException("Room number already in use: " + request.getRoomNumber());
            }
            room.setRoomNumber(request.getRoomNumber());
        }
        if (request.getRoomType() != null) room.setRoomType(request.getRoomType());
        if (request.getFloor() != null) room.setFloor(request.getFloor());
        if (request.getCapacity() != null) room.setCapacity(request.getCapacity());
        if (request.getPricePerNight() != null) room.setPricePerNight(request.getPricePerNight());
        if (request.getStatus() != null) room.setStatus(request.getStatus());
        if (request.getDescription() != null) room.setDescription(request.getDescription());
        if (request.getAmenities() != null) room.setAmenities(request.getAmenities());

        room = roomRepository.save(room);

        if (request.getStatus() != null && !request.getStatus().equals(oldStatus)) {
            auditLogService.log("ROOM_STATUS_CHANGED", "Room", room.getId(), performer,
                    "Room " + room.getRoomNumber() + " status changed from " + oldStatus + " to " + room.getStatus());
        }

        log.info("Room updated: {}", room.getRoomNumber());
        return mapToResponse(room);
    }

    @Override
    public void deleteRoom(Long id, User performer) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        List<Booking> activeBookings = bookingRepository.findByRoom_Id(id).stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.CHECKED_IN)
                .collect(Collectors.toList());

        if (!activeBookings.isEmpty()) {
            throw new ConflictException("Cannot delete room with active bookings. Room: " + room.getRoomNumber());
        }

        auditLogService.log("ROOM_DELETED", "Room", id, performer,
                "Room deleted: " + room.getRoomNumber());

        roomRepository.delete(room);
        log.info("Room deleted: {}", room.getRoomNumber());
    }

    private RoomResponse mapToResponse(Room room) {
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
}
