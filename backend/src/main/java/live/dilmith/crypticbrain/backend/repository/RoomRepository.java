package live.dilmith.crypticbrain.backend.repository;

import jakarta.persistence.LockModeType;
import live.dilmith.crypticbrain.backend.entity.Room;
import live.dilmith.crypticbrain.backend.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    boolean existsByRoomNumber(String roomNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.id = :id")
    Optional<Room> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT r FROM Room r WHERE " +
           "(:type IS NULL OR r.roomType = :type) AND " +
           "(:floor IS NULL OR r.floor = :floor) AND " +
           "(:capacity IS NULL OR r.capacity >= :capacity) AND " +
           "r.status != live.dilmith.crypticbrain.backend.enums.RoomStatus.UNDER_MAINTENANCE AND " +
           "NOT EXISTS (SELECT b FROM Booking b WHERE b.room = r AND " +
           "b.status IN (live.dilmith.crypticbrain.backend.enums.BookingStatus.CONFIRMED, live.dilmith.crypticbrain.backend.enums.BookingStatus.CHECKED_IN) AND " +
           "b.checkInDate < :checkOut AND b.checkOutDate > :checkIn)")
    List<Room> findAvailableRooms(
            @Param("type") RoomType type,
            @Param("floor") Integer floor,
            @Param("capacity") Integer capacity,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );
}
