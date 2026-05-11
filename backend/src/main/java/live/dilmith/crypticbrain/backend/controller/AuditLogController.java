package live.dilmith.crypticbrain.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dilmith.crypticbrain.backend.dto.audit.AuditLogResponse;
import live.dilmith.crypticbrain.backend.response.ApiResponse;
import live.dilmith.crypticbrain.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Audit Logs", description = "Audit log endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get audit logs with optional filters")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAllLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long performedById) {
        List<AuditLogResponse> logs = auditLogService.getAllLogs(entityType, performedById);
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved successfully", logs));
    }
}
