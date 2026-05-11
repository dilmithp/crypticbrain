package live.dilmith.crypticbrain.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import live.dilmith.crypticbrain.backend.dto.booking.BookingCancelRequest;
import live.dilmith.crypticbrain.backend.dto.booking.BookingCreateRequest;
import live.dilmith.crypticbrain.backend.dto.booking.BookingResponse;
import live.dilmith.crypticbrain.backend.entity.User;
import live.dilmith.crypticbrain.backend.enums.BookingStatus;
import live.dilmith.crypticbrain.backend.response.ApiResponse;
import live.dilmith.crypticbrain.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Booking Management", description = "Hotel booking endpoints")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Get all bookings with optional filters")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) Long roomId,
            @RequestParam(required = false) String guestEmail) {
        List<BookingResponse> bookings = bookingService.getAllBookings(status, roomId, guestEmail);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", bookingService.getBookingById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Create a new booking")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            @AuthenticationPrincipal User currentUser) {
        BookingResponse response = bookingService.createBooking(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Booking created successfully", response));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingCancelRequest request,
            @AuthenticationPrincipal User currentUser) {
        BookingResponse response = bookingService.cancelBooking(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", response));
    }

    @PatchMapping("/{id}/checkin")
    @PreAuthorize("hasAnyRole('MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Check in a guest")
    public ResponseEntity<ApiResponse<BookingResponse>> checkIn(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        BookingResponse response = bookingService.checkIn(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Guest checked in successfully", response));
    }

    @PatchMapping("/{id}/checkout")
    @PreAuthorize("hasAnyRole('MANAGER', 'RECEPTIONIST')")
    @Operation(summary = "Check out a guest")
    public ResponseEntity<ApiResponse<BookingResponse>> checkOut(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        BookingResponse response = bookingService.checkOut(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Guest checked out successfully", response));
    }
}
