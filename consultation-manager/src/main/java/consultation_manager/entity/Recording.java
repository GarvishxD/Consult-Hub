package consultation_manager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recordings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recording {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileType;

    private String filePath;

    private LocalDateTime uploadedAt;

    @ManyToOne
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;
}