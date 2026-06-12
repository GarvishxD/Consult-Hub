package consultation_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDto {

    private long totalClients;
    private long totalConsultations;
    private long totalRecordings;
    private List<ClientDto> recentClients;
    private List<ConsultationDto> recentConsultations;
    private List<RecordingDto> recentRecordings;
}
