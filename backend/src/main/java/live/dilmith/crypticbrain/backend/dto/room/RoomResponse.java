package live.dilmith.crypticbrain.backend.dto.room;

import live.dilmith.crypticbrain.backend.enums.RoomStatus;
import live.dilmith.crypticbrain.backend.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {

    private Long id;
    private String roomNumber;
    private RoomType roomType;
    private Integer floor;
    private Integer capacity;
    private BigDecimal pricePerNight;
    private RoomStatus status;
    private String description;
    private String amenities;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
