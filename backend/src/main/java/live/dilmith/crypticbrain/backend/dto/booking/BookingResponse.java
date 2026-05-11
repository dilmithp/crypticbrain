package live.dilmith.crypticbrain.backend.dto.booking;

import live.dilmith.crypticbrain.backend.dto.room.RoomResponse;
import live.dilmith.crypticbrain.backend.dto.user.UserResponse;
import live.dilmith.crypticbrain.backend.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private RoomResponse room;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BookingStatus status;
    private BigDecimal totalPrice;
    private UserResponse bookedBy;
    private UserResponse cancelledBy;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
