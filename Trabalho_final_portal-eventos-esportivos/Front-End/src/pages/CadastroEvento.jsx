import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CadastroEvento() {
    // Aqui eu defino os estados que vão guardar os dados digitados no formulário de criação
    const [titulo, setTitulo] = useState('');
    const [dataEvento, setDataEvento] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [tipo, setTipo] = useState('');
    const [descricao, setDescricao] = useState('');

    // Este estado serve para armazenar a lista de todos os eventos puxados do banco
    const [meusEventos, setMeusEventos] = useState([]);

    // O useEffect garante que a lista seja carregada assim que o organizador acessa a tela
    useEffect(() => {
        carregarEventos();
    }, []);

    // Função que faz o GET na API para buscar os eventos
    const carregarEventos = async () => {
        try {
            const resposta = await axios.get('http://localhost:8080/api/eventos');
            setMeusEventos(resposta.data);
        } catch (erro) {
            console.error("Erro ao carregar eventos:", erro);
        }
    };

    // Função principal acionada quando o botão "Publicar Evento" é clicado
    const handleCriarEvento = async (e) => {
        // Previne o recarregamento da página
        e.preventDefault();
        // Busco quem é o usuário logado para carimbar ele como dono deste evento
        const emailLogado = localStorage.getItem('emailUsuario'); 

        try {
            // Faço o POST enviando os dados do estado para o Back-End em Java
            await axios.post('http://localhost:8080/api/eventos', {
                titulo, 
                dataEvento, 
                localizacao, 
                tipo, 
                descricao,
                emailOrganizador: emailLogado // Carimba o evento com o dono
            });
            alert('Evento criado com sucesso! 🚀');
            setTitulo(''); setDataEvento(''); setLocalizacao(''); setTipo(''); setDescricao('');
            carregarEventos(); 
        } catch (erro) {
            console.error(erro);
            alert('Erro ao criar o evento.');
        }
    };

    // Função para excluir um evento 
    const handleExcluir = async (id) => {
        // Confirmação de segurança para evitar exclusão acidental
        if (window.confirm("Tem certeza que deseja cancelar e excluir este evento?")) {
            try {
                await axios.delete(`http://localhost:8080/api/eventos/${id}`);
                alert("Evento excluído!");
                carregarEventos(); // Atualiza a tela após apagar
            } catch (erro) {
                console.error("Erro ao excluir:", erro);
                alert("Não foi possível excluir o evento.");
            }
        }
    };

    //  A mágica da filtragem: eu pego o e-mail atual da sessão
    const emailLogado = localStorage.getItem('emailUsuario');
    
    // crio uma lista secundária que contém apenas os eventos onde o 'emailOrganizador' é igual ao meu e-mail logado
    // Isso impede que um organizador veja ou apague eventos de outro organizador
    const meusEventosFiltrados = meusEventos.filter(evento => evento.emailOrganizador === emailLogado);

    return (
        <div className="container" style={{ width: '100%', maxWidth: '900px' }}>
            
            {/* FORMULÁRIO DE CRIAÇÃO */}
            <div className="card" style={{ maxWidth: '100%', marginBottom: '40px' }}>
                <h2>Criar Novo Evento</h2>
                
                {/* O formulário agora está estruturado corretamente dentro do onSubmit */}
                <form onSubmit={handleCriarEvento} className="form-group">
                    <input type="text" placeholder="Nome do Evento" className="input-field" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                    
                    {/* Elementos agrupados em flexbox para ficarem lado a lado */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <input type="date" className="input-field" style={{ flex: 1 }} value={dataEvento} onChange={(e) => setDataEvento(e.target.value)} required />
                        <input type="text" placeholder="Localização" className="input-field" style={{ flex: 1 }} value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} required />
                        <input type="text" placeholder="Tipo do Evento (Ex: Corrida, Passeio...)" className="input-field" style={{ flex: 1 }} value={tipo} onChange={(e) => setTipo(e.target.value)} required />
                    </div>
                    
                    <textarea placeholder="Descrição do evento..." className="input-field" rows="3" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
                    <button type="submit" className="btn btn-success">Publicar Evento</button>
                </form>
            </div>

            {/* LISTA DE EVENTOS E INSCRITOS */}
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Gerenciar Meus Eventos</h2>
            
            {/* Eu percorro apenas a lista filtrada para renderizar os cards de gerenciamento */}
            {meusEventosFiltrados.map((evento) => (
                <div key={evento.id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    
                    <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#3498db', marginBottom: '10px' }}>{evento.titulo}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#555' }}><strong>Data:</strong> {evento.dataEvento} | <strong>Local:</strong> {evento.localizacao}</p>
                        
                        {/* LISTA DE PESSOAS INSCRITAS */}
                        {/* Mostro a quantidade de inscritos usando .length, e depois faço um map() para listar os e-mails */}
                        <div style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
                            <strong style={{ color: '#2c3e50', fontSize: '0.9rem' }}>📋 Lista de Inscritos ({evento.participantes ? evento.participantes.length : 0}):</strong>
                            <ul style={{ marginTop: '5px', paddingLeft: '20px', fontSize: '0.85rem', color: '#555' }}>
                                {evento.participantes && evento.participantes.length > 0 ? (
                                    evento.participantes.map((pessoa, index) => (
                                        <li key={index}>{pessoa.email}</li>
                                    ))
                                ) : (
                                    <li>Ninguém se inscreveu ainda.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div style={{ marginLeft: '20px' }}>
                        {/* Botão para chamar a função de exclusão passando o ID específico deste evento */}
                        <button onClick={() => handleExcluir(evento.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Excluir
                        </button>
                    </div>
                </div>
            ))}

        </div>
    );
}