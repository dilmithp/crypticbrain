package live.dilmith.crypticbrain.backend.repository;

import live.dilmith.crypticbrain.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByEntityTypeOrderByTimestampDesc(String entityType);

    List<AuditLog> findByPerformedBy_IdOrderByTimestampDesc(Long userId);
}
