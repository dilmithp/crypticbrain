package live.dilmith.crypticbrain.backend.service;

import live.dilmith.crypticbrain.backend.dto.auth.LoginRequest;
import live.dilmith.crypticbrain.backend.dto.auth.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
