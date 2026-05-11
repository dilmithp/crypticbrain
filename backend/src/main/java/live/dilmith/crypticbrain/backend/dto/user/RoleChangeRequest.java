package live.dilmith.crypticbrain.backend.dto.user;

import jakarta.validation.constraints.NotNull;
import live.dilmith.crypticbrain.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleChangeRequest {

    @NotNull
    private Role role;
}
