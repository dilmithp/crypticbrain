package live.dilmith.crypticbrain.backend.dto.room;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import live.dilmith.crypticbrain.backend.enums.RoomStatus;
import live.dilmith.crypticbrain.backend.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomCreateRequest {

    @NotBlank
    private String roomNumber;

    @NotNull
    private RoomType roomType;

    @NotNull
    private Integer floor;

    @NotNull
    @Min(1)
    private Integer capacity;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal pricePerNight;

    private RoomStatus status;

    private String description;

    private String amenities;
}
