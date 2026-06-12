package consultation_manager.repository;

import consultation_manager.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository
        extends JpaRepository<Client, Long> {

    List<Client> findByNameContainingIgnoreCase(
            String name);
}