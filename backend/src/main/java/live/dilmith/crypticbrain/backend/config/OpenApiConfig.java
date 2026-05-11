package live.dilmith.crypticbrain.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "CrypticBrain API",
                version = "v1",
                description = "Backend API for CrypticBrain Full-Stack Application"
        )
)
public class OpenApiConfig {
}
