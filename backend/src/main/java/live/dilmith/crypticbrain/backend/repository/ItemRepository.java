package live.dilmith.crypticbrain.backend.repository;

import live.dilmith.crypticbrain.backend.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
}
