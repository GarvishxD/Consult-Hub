package consultation_manager.service;

import consultation_manager.dto.AdminStatsDto;
import consultation_manager.dto.ClientDto;
import consultation_manager.dto.ConsultationDto;
import consultation_manager.dto.RecordingDto;
import consultation_manager.entity.Client;
import consultation_manager.entity.Consultation;
import consultation_manager.entity.Recording;
import consultation_manager.repository.ClientRepository;
import consultation_manager.repository.ConsultationRepository;
import consultation_manager.repository.RecordingRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final ClientRepository clientRepository;
    private final ConsultationRepository consultationRepository;
    private final RecordingRepository recordingRepository;

    public AdminService(
            ClientRepository clientRepository,
            ConsultationRepository consultationRepository,
            RecordingRepository recordingRepository) {

        this.clientRepository = clientRepository;
        this.consultationRepository = consultationRepository;
        this.recordingRepository = recordingRepository;
    }

    public AdminStatsDto getAdminStats() {

        List<ClientDto> recentClients = clientRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id")))
                .stream()
                .map(this::toClientDto)
                .toList();

        List<ConsultationDto> recentConsultations = consultationRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id")))
                .stream()
                .map(this::toConsultationDto)
                .toList();

        List<RecordingDto> recentRecordings = recordingRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id")))
                .stream()
                .map(this::toRecordingDto)
                .toList();

        return new AdminStatsDto(
                clientRepository.count(),
                consultationRepository.count(),
                recordingRepository.count(),
                recentClients,
                recentConsultations,
                recentRecordings
        );
    }

    private ClientDto toClientDto(Client client) {
        return new ClientDto(
                client.getId(),
                client.getName(),
                client.getEmail(),
                client.getPhone()
        );
    }

    private ConsultationDto toConsultationDto(Consultation consultation) {
        return new ConsultationDto(
                consultation.getId(),
                consultation.getConsultationDate(),
                consultation.getRemarks(),
                consultation.getClient() != null ? consultation.getClient().getId() : null,
                consultation.getClient() != null ? consultation.getClient().getName() : null
        );
    }

    private RecordingDto toRecordingDto(Recording recording) {
        Consultation consultation = recording.getConsultation();
        return new RecordingDto(
                recording.getId(),
                recording.getFileName(),
                recording.getFileType(),
                recording.getUploadedAt(),
                consultation != null ? consultation.getId() : null,
                consultation != null && consultation.getClient() != null
                        ? consultation.getClient().getName() : null
        );
    }
}
