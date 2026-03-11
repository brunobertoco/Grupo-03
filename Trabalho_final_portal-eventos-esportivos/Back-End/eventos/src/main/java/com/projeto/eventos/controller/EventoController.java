package com.projeto.eventos.controller;

import com.projeto.eventos.model.Evento;
import com.projeto.eventos.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin("*") // Liberando a comunicação com o React
public class EventoController {

    @Autowired
    private EventoRepository repository;

    @Autowired
    private com.projeto.eventos.repository.UsuarioRepository usuarioRepository;

    // Rota para alimentar a vitrine e a agenda esportiva do React
    @GetMapping
    public List<Evento> listarTodos() {
        // Vou no banco e puxo todas as provas cadastradas
        return repository.findAll();
    }

    // Rota exclusiva do Organizador para criar uma nova prova no sistema
    @PostMapping
    public Evento criar(@RequestBody Evento evento) {
        // Recebo os dados do formulário e salvo o evento no banco
        return repository.save(evento);
    }

    // Rota responsável por garantir a vaga do atleta na prova
    @PostMapping("/{idEvento}/inscrever")
    public ResponseEntity<?> inscreverUsuario(@PathVariable Long idEvento, @RequestBody com.projeto.eventos.model.Usuario usuarioData) {

        // Procuro o evento específico pelo ID dele
        Evento evento = repository.findById(idEvento).orElse(null);

        // Encontro o atleta no banco usando o e-mail que o React enviou
        com.projeto.eventos.model.Usuario usuario = usuarioRepository.findByEmail(usuarioData.getEmail());

        // Se houver algum erro e um dos dois não existir, trava a operação
        if (evento == null || usuario == null) {
            return ResponseEntity.badRequest().body("Evento ou Usuário não encontrado!");
        }

        // Adiciono esse atleta na lista de inscritos do evento
        evento.getParticipantes().add(usuario);

        // Salvo o evento atualizado no banco para confirmar a inscrição
        repository.save(evento);

        return ResponseEntity.ok("Inscrição realizada com sucesso!");
    }

    // Rota para o Organizador cancelar uma prova inteira
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarEvento(@PathVariable Long id) {
        // Banco para excluir o evento e todas as relações de inscrição dele
        repository.deleteById(id);
        return ResponseEntity.ok("Evento excluído com sucesso!");
    }

    // Rota que alimenta a tela de "Minhas Provas" do atleta
    @GetMapping("/historico/{email}")
    public ResponseEntity<List<Evento>> buscarHistorico(@PathVariable String email) {
        // Utilizo uma busca customizada para trazer apenas os eventos onde este e-mail está na lista de participantes
        List<Evento> historico = repository.findByParticipantesEmail(email);
        return ResponseEntity.ok(historico);
    }

    // Rota que permite o atleta desistir de uma prova e liberar a vaga
    @DeleteMapping("/{id}/cancelar/{email}")
    public ResponseEntity<?> cancelarInscricao(@PathVariable Long id, @PathVariable String email) {

        // Busco o evento no banco pelo ID
        java.util.Optional<com.projeto.eventos.model.Evento> eventoOpt = repository.findById(id);

        if (eventoOpt.isPresent()) {
            com.projeto.eventos.model.Evento evento = eventoOpt.get();

            // Uso uma função lambda para varrer a lista de inscritos e remover quem tiver o e-mail igual ao logado
            boolean removido = evento.getParticipantes().removeIf(participante -> participante.getEmail().equals(email));

            // Se a remoção deu certo, salvo o evento atualizado no banco
            if (removido) {
                repository.save(evento);
                return ResponseEntity.ok("Inscrição cancelada com sucesso!");
            } else {
                return ResponseEntity.badRequest().body("Atleta não estava inscrito nesta prova.");
            }
        }

        // Se não achou o evento, retorna erro 404
        return ResponseEntity.notFound().build();
    }
}