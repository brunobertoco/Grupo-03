package com.projeto.eventos.repository;

import com.projeto.eventos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Esse método customizado vai buscar o usuário no banco pelo e-mail na hora do Login!
    Usuario findByEmail(String email);

}