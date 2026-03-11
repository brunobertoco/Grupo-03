package com.projeto.eventos.repository;

import com.projeto.eventos.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    //O Java lê esse nome e já sabe que deve buscar os eventos onde o email do participante seja igual
    List<Evento> findByParticipantesEmail(String email);

}