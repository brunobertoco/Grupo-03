package com.projeto.eventos.controller;

import com.projeto.eventos.model.Usuario;
import com.projeto.eventos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // Aqui permito que o React consiga conversar com o Java sem ser bloqueado
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    // Rota criada para autenticar o usuário no sistema
    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestBody Usuario dadosLogin) {

        // Primeiro, busco no banco de dados se existe algum usuário com o e-mail digitado
        Usuario usuario = repository.findByEmail(dadosLogin.getEmail());

        // Se encontrei o usuário, comparo se a senha digitada bate com a do banco
        // Utilizo o .trim() para evitar que espaços em branco invisíveis deem erro de senha!
        if (usuario != null && usuario.getSenha().trim().equals(dadosLogin.getSenha().trim())) {

            // Se estiver tudo certo, devolvo uma resposta de sucesso junto com o perfil (Organizador ou Participante)
            return ResponseEntity.ok(Map.of("mensagem", "Login efetuado", "perfil", usuario.getPerfil()));
        }

        // Se falhou na busca ou na senha, eu retorno o erro 401
        return ResponseEntity.status(401).body("Email ou senha incorretos");
    }

    // Rota criada para registrar novos atletas ou organizadores
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario novoUsuario) {

        // Antes de salvar, eu verifico no banco se esse e-mail já está sendo usado
        if (repository.findByEmail(novoUsuario.getEmail()) != null) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado!");
        }

        // Se a pessoa estiver se cadastrando pela tela normal e não enviar um perfil, defino o padrão como PARTICIPANTE
        if (novoUsuario.getPerfil() == null || novoUsuario.getPerfil().isEmpty()) {
            novoUsuario.setPerfil("PARTICIPANTE");
        }

        // Por fim, salvar o novo usuário no banco de dados
        repository.save(novoUsuario);
        return ResponseEntity.ok(novoUsuario);
    }
}