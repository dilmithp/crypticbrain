package live.dilmith.crypticbrain.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ItemResponseDto {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

}
