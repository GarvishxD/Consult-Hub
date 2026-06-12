package consultation_manager.service;

import consultation_manager.entity.Client;
import consultation_manager.entity.Consultation;
import consultation_manager.exception.ResourceNotFoundException;
import consultation_manager.repository.ClientRepository;
import consultation_manager.repository.ConsultationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final ClientRepository clientRepository;

    public ConsultationService(ConsultationRepository consultationRepository,
                               ClientRepository clientRepository) {
        this.consultationRepository = consultationRepository;
        this.clientRepository = clientRepository;
    }

    // Create Consultation
    public Consultation createConsultation(Long clientId,
                                           Consultation consultation) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Client not found with id : " + clientId));

        consultation.setClient(client);

        return consultationRepository.save(consultation);
    }

    // Get All
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    // Get By Id
    public Consultation getConsultationById(Long id) {

        return consultationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Consultation not found with id : " + id));
    }

    // Update
    public Consultation updateConsultation(Long id,
                                           Consultation updatedConsultation) {

        Consultation consultation = getConsultationById(id);

        consultation.setConsultationDate(
                updatedConsultation.getConsultationDate());

        consultation.setRemarks(
                updatedConsultation.getRemarks());

        return consultationRepository.save(consultation);
    }

    // Delete
    public void deleteConsultation(Long id) {

        Consultation consultation = getConsultationById(id);

        consultationRepository.delete(consultation);
    }

    public List<Consultation> searchConsultations(String query) {

        List<Consultation> byRemarks =
                consultationRepository.findByRemarksContainingIgnoreCase(query);

        List<Consultation> byClient =
                consultationRepository.findByClient_NameContainingIgnoreCase(query);

        return java.util.stream.Stream.concat(byRemarks.stream(), byClient.stream())
                .distinct()
                .toList();
    }
}