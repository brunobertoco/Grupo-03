import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
    // Aqui eu inicio o estado que vai armazenar os eventos da vitrine
    const [eventos, setEventos] = useState([]);
    
    // O useNavigate é o que eu uso para redirecionar o usuário entre as telas pelo código
    const navigate = useNavigate();
    
    // Faço uma verificação no armazenamento do navegador (localStorage) para saber se tem alguém logado e qual o papel dele
    const usuarioLogado = localStorage.getItem('perfil') !== null;
    const perfilUsuario = localStorage.getItem('perfil');

    // O useEffect garante que a busca de eventos aconteça automaticamente assim que essa página carregar
    useEffect(() => {
        buscarEventos();
    }, []);

    // Aqui eu bato lá na minha API em Java para buscar as provas cadastradas
    const buscarEventos = async () => {
        try {
            const resposta = await axios.get('http://localhost:8080/api/eventos');
            // Como é só a página inicial, eu uso o slice(0, 3) para exibir apenas as 3 primeiras provas, como um "Destaque"
            setEventos(resposta.data.slice(0, 3));
        } catch (erro) {
            console.error("Erro ao buscar eventos:", erro);
        }
    };

    // Criei essa função auxiliar de formatação porque o banco salva a data no padrão americano (AAAA-MM-DD)
    // Eu corto a data e remonto no padrão brasileiro (DD/MM/AAAA) para a interface ficar amigável
    const formatarDataBrasil = (dataSql) => {
        if (!dataSql) return '';
        const partes = dataSql.split('-'); 
        if (partes.length !== 3) return dataSql; 
        return `${partes[2]}/${partes[1]}/${partes[0]}`; 
    };

    return (
        <div className="home-container">
            
            {/* SEÇÃO DE DESTAQUE */}
            <header className="hero-section">
                <h1>A sua plataforma de eventos.</h1>
                <p>
                    O ponto de encontro oficial dos atletas. Explore o calendário esportivo da nossa região, organize suas próprias competições e junte-se a uma comunidade apaixonada por esportes.
                </p>
                
                {/* Regra de tela: Eu só mostro os botões de Login e Cadastro se o usuário for um visitante. Se já estiver logado, eu escondo para limpar a tela. */}
                {!usuarioLogado && (
                    <div className="hero-buttons" style={{ marginTop: '20px' }}>
                        <Link to="/login" className="btn btn-primary">Fazer Login</Link>
                        <Link to="/cadastro-usuario" className="btn btn-success">Criar Minha Conta</Link>
                    </div>
                )}
            </header>

            {/* VITRINE DE EVENTOS REAIS (DINÂMICO) */}
            <div className="full-width-section-wrapper">
                <div className="container">
                    <h2 style={{ color: '#000000', marginBottom: '10px', textAlign: 'center' }}>
                        Eventos em Destaque
                    </h2>
                    <p style={{ textAlign: 'center', color: '#000000', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                        Descubra as próximas provas que vão agitar a cidade. Garanta sua inscrição e prepare-se para o próximo desafio.
                    </p>
                    
                    <div className="features-grid">
                        {/* Eu faço um map() no meu estado para renderizar os cartões (cards) automaticamente com os dados que vieram do banco */}
                        {eventos.length > 0 ? (
                            eventos.map((evento) => (
                                <div key={evento.id} className="feature-card" style={{ borderTop: '4px solid #3498db' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#3498db', fontWeight: 'bold' }}>{evento.tipo.toUpperCase()}</span>
                                    <h3 style={{ marginTop: '10px' }}>{evento.titulo}</h3>
                                    
                                    <div style={{ margin: '15px 0', borderTop: '1px dashed #ecf0f1', paddingTop: '15px' }}>
                                        <p style={{ marginBottom: '8px' }}>📍 <strong>Local:</strong> {evento.localizacao}</p>
                                        
                                        {/* É aqui que eu chamo a função de formatação de data para o usuário ler facilmente */}
                                        <p>📅 <strong>Data:</strong> {formatarDataBrasil(evento.dataEvento)}</p>
                                    </div>
                                    
                                    {/* Mais uma regra inteligente de navegação: se logado, o botão leva pra Agenda de Inscrição. Se não, obrigo a passar pelo Login primeiro. */}
                                    {usuarioLogado ? (
                                        <Link to="/agenda" className="btn btn-primary" style={{ display: 'block', marginTop: '15px', textDecoration: 'none', fontSize: '0.9rem' }}>
                                            Confirmar Presença
                                        </Link>
                                    ) : (
                                        <Link to="/login" className="btn btn-success" style={{ display: 'block', marginTop: '15px', textDecoration: 'none', fontSize: '0.9rem' }}>
                                            Login para Participar
                                        </Link>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', width: '100%' }}>Nenhum evento disponível no momento.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* SEÇÃO DE INFORMAÇÕES INTERATIVAS */}
            <div className="full-width-alt-wrapper">
                <div className="content-limpo">
                    
                    <h2 style={{ color: '#000000', textAlign: 'center', marginBottom: '10px' }}>
                        O que você pode fazer por aqui?
                    </h2>
                    <p style={{ textAlign: 'center', color: '#000000', marginBottom: '40px', maxWidth: '600px' }}>
                        Nossa plataforma foi desenhada para facilitar a vida tanto de quem participa, quanto de quem trabalha nos bastidores organizando tudo.
                    </p>
                    
                    <div className="features-grid-3">
                        
                        {/* Os cliques nos cards são bloqueados por perfil. Só quem é ORGANIZADOR consegue navegar para a tela de criar eventos. Os outros caem no login. */}
                        <div 
                            className="feature-card interactive" 
                            onClick={() => navigate(perfilUsuario === 'ORGANIZADOR' ? '/eventos' : '/login')}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            <h3 style={{ color: '#3498db' }}>📅 Organizar</h3>
                            <p>Crie e divulgue seus eventos, definindo datas, locais e categorias para o seu público alvo de forma simplificada.</p>
                            <small style={{ color: '#3498db', display: 'block', marginTop: '15px' }}>Acesse o Painel →</small>
                        </div>
                        
                        <div 
                            className="feature-card interactive" 
                            onClick={() => navigate('/agenda')}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            <h3 style={{ color: '#3498db' }}>👥 Participar</h3>
                            <p>Fique por dentro do calendário esportivo e garanta sua presença nos melhores eventos com apenas um clique.</p>
                            <small style={{ color: '#3498db', display: 'block', marginTop: '15px' }}>Ver Agenda →</small>
                        </div>
                        
                        <div 
                            className="feature-card interactive" 
                            onClick={() => navigate(usuarioLogado ? '/historico' : '/login')}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            <h3 style={{ color: '#3498db' }}>📊 Gerenciar</h3>
                            <p>Tenha o controle centralizando suas provas e resultados em um único sistema.</p>
                            <small style={{ color: '#3498db', display: 'block', marginTop: '15px' }}>Ver Histórico →</small>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}