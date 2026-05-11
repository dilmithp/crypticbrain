package live.dilmith.crypticbrain.backend.config;

import live.dilmith.crypticbrain.backend.entity.Room;
import live.dilmith.crypticbrain.backend.entity.User;
import live.dilmith.crypticbrain.backend.enums.Role;
import live.dilmith.crypticbrain.backend.enums.RoomStatus;
import live.dilmith.crypticbrain.backend.enums.RoomType;
import live.dilmith.crypticbrain.backend.repository.RoomRepository;
import live.dilmith.crypticbrain.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByRole(Role.ADMIN)) {
            User admin = User.builder()
                    .firstName("Amara")
                    .lastName("Perera")
                    .email("admin@hotel.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            User receptionist = User.builder()
                    .firstName("Nuwan")
                    .lastName("Silva")
                    .email("nuwan.reception@hotel.com")
                    .password(passwordEncoder.encode("Staff@123"))
                    .role(Role.RECEPTIONIST)
                    .active(true)
                    .build();

            userRepository.saveAll(List.of(admin, receptionist));
            log.info("Default Sri Lankan users created: admin@hotel.com, nuwan.reception@hotel.com");
        }

        if (roomRepository.count() == 0) {
            Room room1 = Room.builder()
                    .roomNumber("101")
                    .roomType(RoomType.DELUXE)
                    .floor(1)
                    .capacity(2)
                    .pricePerNight(new BigDecimal("15000.00")) // LKR
                    .status(RoomStatus.AVAILABLE)
                    .description("Beautiful deluxe room with a view of the Indian Ocean.")
                    .amenities("Sea View, Free Wi-Fi, A/C, Minibar, Balcony")
                    .build();

            Room room2 = Room.builder()
                    .roomNumber("102")
                    .roomType(RoomType.SINGLE)
                    .floor(1)
                    .capacity(1)
                    .pricePerNight(new BigDecimal("8000.00"))
                    .status(RoomStatus.AVAILABLE)
                    .description("Cozy single room perfect for solo travelers visiting Colombo.")
                    .amenities("Free Wi-Fi, A/C, TV")
                    .build();

            Room room3 = Room.builder()
                    .roomNumber("201")
                    .roomType(RoomType.SUITE)
                    .floor(2)
                    .capacity(4)
                    .pricePerNight(new BigDecimal("35000.00"))
                    .status(RoomStatus.AVAILABLE)
                    .description("Luxury suite featuring traditional Sri Lankan wooden crafts and modern amenities.")
                    .amenities("Sea View, Free Wi-Fi, A/C, Minibar, Jacuzzi, Living Room")
                    .build();

            roomRepository.saveAll(List.of(room1, room2, room3));
            log.info("Default Sri Lankan rooms created.");
        }
    }
}
