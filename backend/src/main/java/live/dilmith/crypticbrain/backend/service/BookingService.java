package live.dilmith.crypticbrain.backend.service;

import live.dilmith.crypticbrain.backend.dto.booking.BookingCancelRequest;
import live.dilmith.crypticbrain.backend.dto.booking.BookingCreateRequest;
import live.dilmith.crypticbrain.backend.dto.booking.BookingResponse;
import live.dilmith.crypticbrain.backend.entity.User;
import live.dilmith.crypticbrain.backend.enums.BookingStatus;

import java.util.List;

public interface BookingService {

    List<BookingResponse> getAllBookings(BookingStatus status, Long roomId, String guestEmail);

    BookingResponse getBookingById(Long id);

    BookingResponse createBooking(BookingCreateRequest request, User bookedBy);

    BookingResponse cancelBooking(Long id, BookingCancelRequest request, User cancelledBy);

    BookingResponse checkIn(Long id, User performer);

    BookingResponse checkOut(Long id, User performer);
}
