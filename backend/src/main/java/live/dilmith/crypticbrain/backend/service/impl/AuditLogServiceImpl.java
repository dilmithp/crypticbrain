package live.dilmith.crypticbrain.backend.service.impl;

import live.dilmith.crypticbrain.backend.dto.audit.AuditLogResponse;
import live.dilmith.crypticbrain.backend.dto.user.UserResponse;
import live.dilmith.crypticbrain.backend.entity.AuditLog;
import live.dilmith.crypticbrain.backend.entity.User;
import live.dilmith.crypticbrain.backend.repository.AuditLogRepository;
import live.dilmith.crypticbrain.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public void log(String action, String entityType, Long entityId, User performedBy, String details) {
        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .performedBy(performedBy)
                .details(details)
                .build();
        auditLogRepository.save(auditLog);
        log.info("Audit log created: action={}, entityType={}, entityId={}", action, entityType, entityId);
    }

    @Override
    public List<AuditLogResponse> getAllLogs(String entityType, Long performedById) {
        List<AuditLog> logs;

        if (entityType != null && !entityType.isBlank()) {
            logs = auditLogRepository.findByEntityTypeOrderByTimestampDesc(entityType);
        } else if (performedById != null) {
            logs = auditLogRepository.findByPerformedBy_IdOrderByTimestampDesc(performedById);
        } else {
            logs = auditLogRepository.findAllByOrderByTimestampDesc();
        }

        return logs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .performedBy(mapUserToResponse(log.getPerformedBy()))
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .build();
    }

    private UserResponse mapUserToResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
