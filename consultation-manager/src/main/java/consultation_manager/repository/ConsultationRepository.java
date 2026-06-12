package consultation_manager.repository;

import consultation_manager.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository
        extends JpaRepository<Consultation, Long> {

    List<Consultation> findByRemarksContainingIgnoreCase(String remarks);

    List<Consultation> findByClient_NameContainingIgnoreCase(String name);
}