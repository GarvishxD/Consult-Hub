package consultation_manager.repository;

import consultation_manager.entity.Recording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordingRepository
        extends JpaRepository<Recording, Long> {

    List<Recording>
    findByFileNameContainingIgnoreCase(
            String fileName);

    long countByConsultationId(
            Long consultationId);
}