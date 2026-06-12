package consultation_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecordingDto {

    private Long id;
    private String fileName;
    private String fileType;
    private LocalDateTime uploadedAt;
    private Long consultationId;
    private String clientName;
}
