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
public class ConsultationDto {

    private Long id;
    private LocalDateTime consultationDate;
    private String remarks;
    private Long clientId;
    private String clientName;
}
