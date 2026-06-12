package consultation_manager.service;

import consultation_manager.entity.Consultation;
import consultation_manager.entity.Recording;
import consultation_manager.exception.ResourceNotFoundException;
import consultation_manager.repository.ConsultationRepository;
import consultation_manager.repository.RecordingRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RecordingService {

    private final RecordingRepository recordingRepository;
    private final ConsultationRepository consultationRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public RecordingService(
            RecordingRepository recordingRepository,
            ConsultationRepository consultationRepository) {

        this.recordingRepository = recordingRepository;
        this.consultationRepository = consultationRepository;
    }

    // Upload Recording
    public Recording uploadRecording(
            Long consultationId,
            MultipartFile file) throws IOException {

        Consultation consultation =
                consultationRepository.findById(consultationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Consultation not found"));

        String fileName =
                UUID.randomUUID() + "_" +
                        file.getOriginalFilename();

        Path path =
                Paths.get(UPLOAD_DIR + fileName);

        Files.createDirectories(path.getParent());

        Files.copy(
                file.getInputStream(),
                path,
                StandardCopyOption.REPLACE_EXISTING);

        Recording recording = new Recording();

        recording.setFileName(fileName);
        recording.setFileType(file.getContentType());
        recording.setFilePath(path.toString());
        recording.setUploadedAt(LocalDateTime.now());
        recording.setConsultation(consultation);

        return recordingRepository.save(recording);
    }

    // Get All Recordings
    public List<Recording> getAllRecordings() {

        return recordingRepository.findAll();
    }

    // Get Recording By Id
    public Recording getRecording(Long id) {

        return recordingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Recording not found with id : " + id));
    }

    // Delete Recording
    public void deleteRecording(Long id) {

        Recording recording = getRecording(id);

        try {

            Files.deleteIfExists(
                    Paths.get(recording.getFilePath()));

        } catch (IOException e) {

            e.printStackTrace();
        }

        recordingRepository.delete(recording);
    }

    // Download Recording
    public Path downloadRecording(Long id) {

        Recording recording = getRecording(id);

        return Paths.get(recording.getFilePath());
    }

    // Search Recording
    public List<Recording> searchRecording(
            String fileName) {

        return recordingRepository
                .findByFileNameContainingIgnoreCase(
                        fileName);
    }

    // Count Recordings By Consultation
    public long countRecordingsByConsultation(
            Long consultationId) {

        return recordingRepository
                .countByConsultationId(
                        consultationId);
    }
}