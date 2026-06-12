package consultation_manager.service;

import consultation_manager.entity.Client;
import consultation_manager.exception.ResourceNotFoundException;
import consultation_manager.repository.ClientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(
            ClientRepository clientRepository) {

        this.clientRepository = clientRepository;
    }

    // CREATE
    public Client saveClient(Client client) {

        return clientRepository.save(client);
    }

    // READ ALL
    public List<Client> getAllClients() {

        return clientRepository.findAll();
    }

    // READ BY ID
    public Client getClientById(Long id) {

        return clientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Client not found with id : "
                                        + id));
    }

    // UPDATE
    public Client updateClient(
            Long id,
            Client updatedClient) {

        Client existingClient =
                getClientById(id);

        existingClient.setName(
                updatedClient.getName());

        existingClient.setEmail(
                updatedClient.getEmail());

        existingClient.setPhone(
                updatedClient.getPhone());

        return clientRepository.save(
                existingClient);
    }

    // DELETE
    public void deleteClient(Long id) {

        Client client =
                getClientById(id);

        clientRepository.delete(client);
    }

    // SEARCH
    public List<Client> searchClient(
            String name) {

        return clientRepository
                .findByNameContainingIgnoreCase(
                        name);
    }

    // PAGINATION
    public Page<Client> getClientsPage(
            Pageable pageable) {

        return clientRepository.findAll(
                pageable);
    }
}