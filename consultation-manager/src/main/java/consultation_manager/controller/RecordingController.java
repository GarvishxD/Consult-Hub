package consultation_manager.controller;

import consultation_manager.dto.RecordingDto;
import consultation_manager.entity.Consultation;
import consultation_manager.entity.Recording;
import consultation_manager.service.RecordingService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/recordings")
public class RecordingController {

    private final RecordingService recordingService;

    public RecordingController(RecordingService recordingService) {
        this.recordingService = recordingService;
    }

    @PostMapping("/upload/{consultationId}")
    public RecordingDto uploadRecording(
            @PathVariable Long consultationId,
            @RequestParam("file") MultipartFile file) throws IOException {

        return toDto(recordingService.uploadRecording(consultationId, file));
    }

    @GetMapping
    public List<RecordingDto> getAllRecordings() {
        return recordingService.getAllRecordings().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public RecordingDto getRecording(@PathVariable Long id) {
        return toDto(recordingService.getRecording(id));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadRecording(@PathVariable Long id)
            throws MalformedURLException {

        Path path = recordingService.downloadRecording(id);
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/search")
    public List<RecordingDto> searchRecording(@RequestParam String fileName) {
        return recordingService.searchRecording(fileName).stream()
                .map(this::toDto)
                .toList();
    }

    @DeleteMapping("/{id}")
    public String deleteRecording(@PathVariable Long id) {
        recordingService.deleteRecording(id);
        return "Recording deleted successfully";
    }

    private RecordingDto toDto(Recording recording) {
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
