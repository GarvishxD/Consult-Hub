package consultation_manager.service;

import consultation_manager.dto.DashboardDto;
import consultation_manager.repository.ClientRepository;
import consultation_manager.repository.ConsultationRepository;
import consultation_manager.repository.RecordingRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ClientRepository clientRepository;
    private final ConsultationRepository consultationRepository;
    private final RecordingRepository recordingRepository;

    public DashboardService(
            ClientRepository clientRepository,
            ConsultationRepository consultationRepository,
            RecordingRepository recordingRepository) {

        this.clientRepository = clientRepository;
        this.consultationRepository = consultationRepository;
        this.recordingRepository = recordingRepository;
    }

    public DashboardDto getDashboard() {

        return new DashboardDto(
                clientRepository.count(),
                consultationRepository.count(),
                recordingRepository.count()
        );
    }
}