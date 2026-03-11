import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Agenda() {
    // Crio dois estados: um para guardar todas as provas que vêm do banco e outro para capturar o que o usuário digita na barra de pesquisa
    const [eventos, setEventos] = useState([]);
    const [busca, setBusca] = useState('');

    // O useEffect garante que a busca inicial no banco seja feita apenas uma vez, assim que a página é montada na tela
    useEffect(() => {
        buscarEventosNoBanco();
    }, []);

    // Faço uma requisição GET para a minha API em Java para trazer o calendário completo
    const buscarEventosNoBanco = async () => {
        try {
            const resposta = await axios.get('http://localhost:8080/api/eventos');
            setEventos(resposta.data);
        } catch (erro) {
            console.error("Erro ao buscar eventos esportivos:", erro);
        }
    };

    // Esta é a função acionada quando o atleta clica no botão "Garantir Inscrição"
    const inscreverNoEvento = async (idEvento) => {
        // Primeiro, verifico se existe alguém logado buscando o e-mail no armazenamento do navegador
        const emailSalvo = localStorage.getItem('emailUsuario');

        // Se não estiver logado, eu travo a ação, aviso o usuário e mando ele para a tela de Login
        if (!emailSalvo) {
            alert("Você precisa fazer login para se inscrever na prova!");
            window.location.href = '/login';
            return;
        }

        try {
            // Se estiver logado, eu envio o ID do evento na URL e o e-mail no corpo da requisição para o Java processar a inscrição
            await axios.post(`http://localhost:8080/api/eventos/${idEvento}/inscrever`, {
                email: emailSalvo
            });
            alert("Inscrição realizada com sucesso! 🏅 Prepare seu tênis, presença confirmada.");
        } catch (erro) {
            console.error("Erro na inscrição:", erro);
            // Se o Java retornar erro (ex: usuário já inscrito), eu aviso na tela
            alert("Não foi possível se inscrever. Você já pode estar inscrito nesta prova!");
        }
    };

    // Criei um filtro inteligente no Front-End. A cada letra digitada na busca, ele recalcula a lista.
    const eventosFiltrados = eventos.filter((evento) => {
        // Transformo tudo em letra minúscula para a pesquisa não falhar por causa de letras maiúsculas
        const termoBusca = busca.toLowerCase();
        
        // Retorno o evento se a palavra digitada existir ou no Título (ex: Maratona) ou no Tipo (ex: Corrida)
        return (
            evento.titulo.toLowerCase().includes(termoBusca) || 
            evento.tipo.toLowerCase().includes(termoBusca)
        );
    });

    // função auxiliar para converter a data do banco (AAAA-MM-DD) para o padrão brasileiro (DD/MM/AAAA)
    const formatarDataBrasil = (dataSql) => {
        if (!dataSql) return '';
        const partes = dataSql.split('-');
        if (partes.length !== 3) return dataSql;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

   return (
        <div className="container" style={{ width: '100%', maxWidth: '1200px', marginTop: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '15px' }}>
                    Calendário Esportivo
                </h2>
                <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
                    Encontre as melhores corridas, passeios e competições da região.
                </p>
                
                {/* BARRA DE PESQUISA */}
                <div style={{ marginTop: '25px', maxWidth: '600px', margin: '25px auto 0 auto' }}>
                    <input 
                        type="text" 
                        placeholder="🔍 Pesquise por prova ou modalidade (ex: Corrida, Ciclismo...)" 
                        className="input-field"
                        value={busca}
                        // Aqui o estado "busca" é atualizado instantaneamente a cada letra digitada
                        onChange={(e) => setBusca(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '15px 20px', 
                            fontSize: '1.1rem', 
                            borderRadius: '30px',
                            border: '2px solid #e67e22', /* Cor laranja esportiva */
                            boxShadow: '0 4px 10px rgba(230, 126, 34, 0.2)'
                        }}
                    />
                </div>
            </div>

            {/* LISTAGEM DOS EVENTOS */}
            <div className="features-grid">
                {/* Se o usuário pesquisar algo que não existe, mostro uma mensagem em vez de uma tela em branco */}
                {eventosFiltrados.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>Nenhuma prova encontrada para "{busca}".</p>
                    </div>
                ) : (
                    /* Caso contrário, faço um map() apenas na lista filtrada e monto os cards na tela */
                    eventosFiltrados.map((evento) => (
                        <div key={evento.id} className="feature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid #e67e22' }}>
                            <div>
                                <span style={{ background: '#fdf2e9', color: '#e67e22', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {evento.tipo}
                                </span>
                                <h3 style={{ marginTop: '15px', marginBottom: '10px', color: '#2c3e50' }}>{evento.titulo}</h3>
                                <p style={{ fontSize: '0.95rem', marginBottom: '8px' }}><strong>📍 Local:</strong> {evento.localizacao}</p>
                                
                                {/* Formato a data para exibição no card */}
                                <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}><strong>📅 Data da Prova:</strong> {formatarDataBrasil(evento.dataEvento)}</p>
                                
                                <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{evento.descricao}</p>
                            </div>

                            <button 
                                className="btn btn-primary" 
                                style={{ marginTop: '20px', width: '100%', backgroundColor: '#e67e22', border: 'none' }}
                                // Quando clicado, envia o ID deste evento específico para a função de inscrição
                                onClick={() => inscreverNoEvento(evento.id)}
                            >
                                Garantir Inscrição
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}