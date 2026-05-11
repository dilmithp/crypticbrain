package live.dilmith.crypticbrain.backend.dto.room;

import live.dilmith.crypticbrain.backend.enums.RoomStatus;
import live.dilmith.crypticbrain.backend.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomUpdateRequest {

    private String roomNumber;
    private RoomType roomType;
    private Integer floor;
    private Integer capacity;
    private BigDecimal pricePerNight;
    private RoomStatus status;
    private String description;
    private String amenities;
}
