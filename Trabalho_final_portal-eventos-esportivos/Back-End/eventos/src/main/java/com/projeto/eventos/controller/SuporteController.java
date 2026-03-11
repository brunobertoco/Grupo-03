package com.projeto.eventos.controller;

import com.projeto.eventos.model.Suporte;
import com.projeto.eventos.repository.SuporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/suporte")
@CrossOrigin("*")
public class SuporteController {

    @Autowired
    private SuporteRepository repository;

    @PostMapping
    public ResponseEntity<?> enviarMensagem(@RequestBody Suporte suporte) {
        repository.save(suporte);
        return ResponseEntity.ok("Mensagem enviada com sucesso!");
    }
}