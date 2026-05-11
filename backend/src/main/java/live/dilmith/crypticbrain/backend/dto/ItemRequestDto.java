package live.dilmith.crypticbrain.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ItemRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

}
