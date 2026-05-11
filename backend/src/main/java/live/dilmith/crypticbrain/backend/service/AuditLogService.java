package live.dilmith.crypticbrain.backend.service;

import live.dilmith.crypticbrain.backend.dto.audit.AuditLogResponse;
import live.dilmith.crypticbrain.backend.entity.User;

import java.util.List;

public interface AuditLogService {

    void log(String action, String entityType, Long entityId, User performedBy, String details);

    List<AuditLogResponse> getAllLogs(String entityType, Long performedById);
}
