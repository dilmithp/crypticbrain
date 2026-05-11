package live.dilmith.crypticbrain.backend.dto.audit;

import live.dilmith.crypticbrain.backend.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {

    private Long id;
    private String action;
    private String entityType;
    private Long entityId;
    private UserResponse performedBy;
    private String details;
    private LocalDateTime timestamp;
}
