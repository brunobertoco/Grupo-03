**Gestão de Eventos Esportivos**

**Sobre o Projeto**
O projeto Gestão de Eventos Esportivos é uma plataforma web completa desenvolvida para centralizar a divulgação e a gestão de corridas de rua, competições e passeios de bike. O sistema atua como uma ponte entre Organizadores (que publicam e gerenciam as competições) e Atletas/Participantes (que buscam provas e gerenciam suas inscrições).

Este projeto foi construído como Trabalho Final da disciplina de Processo de Desenvolvimento de Software (PDS) do curso de Sistemas de Informação da Universidade Federal de Uberlândia (UFU).

**Funcionalidades Implementadas (Entrega Final)**

* **Autenticação de Perfis:** Sistema de Login e Cadastro com separação de privilégios (Atleta vs. Organizador).
* **Calendário Esportivo:** Vitrine pública e interativa com barra de busca em tempo real por título ou modalidade.
* **Painel do Organizador:** Área restrita para criação de novos eventos, visualização da lista de atletas inscritos e exclusão de provas.
* **Gestão de Inscrições:** Confirmação de presença em eventos com apenas um clique e painel "Minhas Provas" com opção de cancelamento de vaga.
* **Central de Suporte:** Formulário integrado para envio de feedbacks, dúvidas e contato direto com a administração da plataforma.

Tecnologias Utilizadas

* **Frontend:** React.js (com Axios e React Router DOM), interface 100% responsiva customizada com Flexbox.
* **Backend:** Java 17+ com Spring Boot, Spring Data JPA e Spring Web.
* **Banco de Dados:** PostgreSQL (gerenciado via DBeaver).
* **Comunicação:** API RESTful.

Como executar o projeto localmente

1. **Banco de Dados:** Certifique-se de ter o PostgreSQL rodando localmente (porta padrão `5432`) e crie um banco de dados vazio chamado `eventodb`.
2. **Backend:** Abra a pasta do projeto Java em sua IDE (IntelliJ/Eclipse) e rode a classe principal `EventosApplication`. O servidor iniciará automaticamente na porta `8080`.
3. **Frontend:** No terminal, navegue até a pasta raiz do React e execute `npm install` para baixar as dependências. Em seguida, rode `npm run dev` (ou `npm start`) para iniciar a interface no navegador.

Equipe
* **Integrante:** Bruno Giamatei Bertoco - Matrícula: 11911BSI236

Status do Projeto
- [x] Kickoff e Planejamento (Sprint 1)
- [x] Desenvolvimento do MVP (Sprint 2)
- [x] Implementação de Funcionalidades (Sprint 3)
- [x] Finalização e Entregas (Sprint 4) - **CONCLUÍDO**
