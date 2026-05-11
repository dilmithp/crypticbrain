package live.dilmith.crypticbrain.backend.entity;

import jakarta.persistence.*;
import live.dilmith.crypticbrain.backend.enums.BookingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String guestName;

    private String guestEmail;

    private String guestPhone;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.CONFIRMED;

    private BigDecimal totalPrice;

    @ManyToOne
    @JoinColumn(name = "booked_by_id")
    private User bookedBy;

    @ManyToOne
    @JoinColumn(name = "cancelled_by_id", nullable = true)
    private User cancelledBy;

    @Column(nullable = true)
    private String cancellationReason;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
