package consultation_manager.controller;

import consultation_manager.dto.ConsultationDto;
import consultation_manager.entity.Consultation;
import consultation_manager.service.ConsultationService;
import consultation_manager.service.RecordingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final RecordingService recordingService;

    public ConsultationController(
            ConsultationService consultationService,
            RecordingService recordingService) {

        this.consultationService = consultationService;
        this.recordingService = recordingService;
    }

    @PostMapping("/client/{clientId}")
    public ConsultationDto createConsultation(
            @PathVariable Long clientId,
            @RequestBody ConsultationDto dto) {

        Consultation consultation = new Consultation();
        consultation.setConsultationDate(dto.getConsultationDate());
        consultation.setRemarks(dto.getRemarks());

        return toDto(consultationService.createConsultation(clientId, consultation));
    }

    @GetMapping
    public List<ConsultationDto> getAllConsultations() {
        return consultationService.getAllConsultations().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ConsultationDto getConsultationById(@PathVariable Long id) {
        return toDto(consultationService.getConsultationById(id));
    }

    @PutMapping("/{id}")
    public ConsultationDto updateConsultation(
            @PathVariable Long id,
            @RequestBody ConsultationDto dto) {

        Consultation consultation = new Consultation();
        consultation.setConsultationDate(dto.getConsultationDate());
        consultation.setRemarks(dto.getRemarks());

        return toDto(consultationService.updateConsultation(id, consultation));
    }

    @DeleteMapping("/{id}")
    public String deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return "Consultation deleted successfully";
    }

    @GetMapping("/search")
    public List<ConsultationDto> searchConsultations(@RequestParam String q) {
        return consultationService.searchConsultations(q).stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}/recordings/count")
    public long countRecordings(@PathVariable Long id) {
        return recordingService.countRecordingsByConsultation(id);
    }

    private ConsultationDto toDto(Consultation consultation) {
        return new ConsultationDto(
                consultation.getId(),
                consultation.getConsultationDate(),
                consultation.getRemarks(),
                consultation.getClient() != null ? consultation.getClient().getId() : null,
                consultation.getClient() != null ? consultation.getClient().getName() : null
        );
    }
}
