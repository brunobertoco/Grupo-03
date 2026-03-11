import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Historico() {
    // Crio o estado para armazenar as provas que pertencem a este atleta específico
    const [meusEventos, setMeusEventos] = useState([]);
    const emailLogado = localStorage.getItem('emailUsuario');

    // Assim que a tela carrega, o useEffect verifica se existe um e-mail salvo na sessão e aciona a busca
    useEffect(() => {
        if (emailLogado) {
            buscarHistorico();
        }
    }, [emailLogado]);

    // Faço um GET na minha rota customizada passando o e-mail do usuário pela URL
    const buscarHistorico = async () => {
        try {
            const resposta = await axios.get(`http://localhost:8080/api/eventos/historico/${emailLogado}`);
            setMeusEventos(resposta.data);
        } catch (erro) {
            console.error("Erro ao buscar histórico:", erro);
        }
    };

    // Função acionada pelo botão "Desistir da Prova"
    const cancelarInscricao = async (idEvento) => {
        // Pede uma confirmação para evitar cliques acidentais
        const confirmacao = window.confirm("Você tem certeza que deseja cancelar sua inscrição nesta prova?");
        
        if (confirmacao) {
            try {
                // Se confirmado, bato na API de exclusão enviando tanto o ID do evento quanto o e-mail do atleta
                await axios.delete(`http://localhost:8080/api/eventos/${idEvento}/cancelar/${emailLogado}`);
                alert("Sua inscrição foi cancelada e a vaga foi liberada.");
                
                // Recarrego a lista para a prova sumir da tela instantaneamente, sem precisar do F5
                buscarHistorico(); 
            } catch (erro) {
                console.error("Erro ao cancelar inscrição:", erro);
                alert("Não foi possível cancelar a inscrição no momento.");
            }
        }
    };

    // Função para garantir que a data apareça no padrão brasileiro (DD/MM/AAAA)
    const formatarDataBrasil = (dataSql) => {
        if (!dataSql) return '';
        const partes = dataSql.split('-');
        if (partes.length !== 3) return dataSql;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

    return (
        <div className="container" style={{ width: '100%', maxWidth: '900px', marginTop: '40px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
                🏅 Minhas Provas
            </h2>
            
            {/* Tratamento de estado vazio: Se a lista estiver vazia, mostro um aviso convidando o usuário para a Agenda */}
            {meusEventos.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', margin: '0 auto' }}>
                    <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
                        Você ainda não está inscrito em nenhuma competição. Vá até a Agenda de Eventos e participe!
                    </p>
                </div>
            ) : (
                /* Caso contrário, uso nossa classe "features-grid" para organizar as provas lado a lado */
                <div className="features-grid">
                    {meusEventos.map((evento) => (
                        <div key={evento.id} className="feature-card" style={{ textAlign: 'left', borderLeft: '5px solid #2ecc71', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>{evento.titulo}</h3>
                                {/* Chamando a formatação da data aqui */}
                                <p style={{ marginBottom: '5px' }}><strong>📅 Data:</strong> {formatarDataBrasil(evento.dataEvento)}</p>
                                <p style={{ marginBottom: '5px' }}><strong>📍 Local:</strong> {evento.localizacao}</p>
                                <p style={{ marginBottom: '5px' }}><strong>🏃 Modalidade:</strong> {evento.tipo}</p>
                                
                                <div style={{ marginTop: '15px', background: '#e8f8f5', padding: '8px', borderRadius: '5px', textAlign: 'center' }}>
                                    <strong style={{ color: '#27ae60', fontSize: '0.9rem' }}>✅ Inscrição Confirmada</strong>
                                </div>
                            </div>

                            {/* BOTÃO DE CANCELAR: Adicionei um hover dinâmico usando eventos do mouse para dar uma sensação de clique real */}
                            <button 
                                onClick={() => cancelarInscricao(evento.id)}
                                style={{
                                    marginTop: '15px',
                                    padding: '10px',
                                    backgroundColor: 'transparent',
                                    color: '#e74c3c',
                                    border: '1px solid #e74c3c',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => { e.target.style.backgroundColor = '#e74c3c'; e.target.style.color = 'white'; }}
                                onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#e74c3c'; }}
                            >
                                Desistir da Prova ❌
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}