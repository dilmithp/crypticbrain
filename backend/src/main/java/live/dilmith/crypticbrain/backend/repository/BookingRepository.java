package live.dilmith.crypticbrain.backend.repository;

import live.dilmith.crypticbrain.backend.entity.Booking;
import live.dilmith.crypticbrain.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND " +
           "b.status IN (live.dilmith.crypticbrain.backend.enums.BookingStatus.CONFIRMED, live.dilmith.crypticbrain.backend.enums.BookingStatus.CHECKED_IN) AND " +
           "b.checkInDate < :checkOut AND b.checkOutDate > :checkIn")
    List<Booking> findOverlappingBookings(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByRoom_Id(Long roomId);

    List<Booking> findByGuestEmailContainingIgnoreCase(String email);
}
