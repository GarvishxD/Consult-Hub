package consultation_manager.controller;

import consultation_manager.dto.ClientDto;
import consultation_manager.entity.Client;
import consultation_manager.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public ClientDto createClient(@Valid @RequestBody ClientDto dto) {
        Client client = new Client();
        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        return toDto(clientService.saveClient(client));
    }

    @GetMapping
    public List<ClientDto> getAllClients() {
        return clientService.getAllClients().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ClientDto getClientById(@PathVariable Long id) {
        return toDto(clientService.getClientById(id));
    }

    @PutMapping("/{id}")
    public ClientDto updateClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientDto dto) {

        Client client = new Client();
        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        return toDto(clientService.updateClient(id, client));
    }

    @DeleteMapping("/{id}")
    public String deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return "Client deleted successfully";
    }

    @GetMapping("/search")
    public List<ClientDto> searchClient(@RequestParam String name) {
        return clientService.searchClient(name).stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/page")
    public Page<ClientDto> getClientsPage(
            @RequestParam int page,
            @RequestParam int size) {

        return clientService.getClientsPage(PageRequest.of(page, size))
                .map(this::toDto);
    }

    private ClientDto toDto(Client client) {
        return new ClientDto(
                client.getId(),
                client.getName(),
                client.getEmail(),
                client.getPhone()
        );
    }
}
