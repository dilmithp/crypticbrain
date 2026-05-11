package live.dilmith.crypticbrain.backend.service;

import live.dilmith.crypticbrain.backend.dto.user.UserCreateRequest;
import live.dilmith.crypticbrain.backend.dto.user.UserResponse;
import live.dilmith.crypticbrain.backend.dto.user.UserUpdateRequest;
import live.dilmith.crypticbrain.backend.entity.User;
import live.dilmith.crypticbrain.backend.enums.Role;

import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse createUser(UserCreateRequest request);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    UserResponse changeRole(Long id, Role newRole, User performer);

    void deactivateUser(Long id);
}
