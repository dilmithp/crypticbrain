package live.dilmith.crypticbrain.backend.service;

import live.dilmith.crypticbrain.backend.dto.room.RoomCreateRequest;
import live.dilmith.crypticbrain.backend.dto.room.RoomResponse;
import live.dilmith.crypticbrain.backend.dto.room.RoomUpdateRequest;
import live.dilmith.crypticbrain.backend.entity.User;
import live.dilmith.crypticbrain.backend.enums.RoomType;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {

    List<RoomResponse> getAllRooms();

    RoomResponse getRoomById(Long id);

    List<RoomResponse> getAvailableRooms(RoomType type, Integer floor, Integer capacity, LocalDate checkIn, LocalDate checkOut);

    RoomResponse createRoom(RoomCreateRequest request, User performer);

    RoomResponse updateRoom(Long id, RoomUpdateRequest request, User performer);

    void deleteRoom(Long id, User performer);
}
