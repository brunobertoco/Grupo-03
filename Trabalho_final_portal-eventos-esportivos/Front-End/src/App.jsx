import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css'; 
import Home from './pages/Home';
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroEvento from './pages/CadastroEvento';
import Agenda from './pages/Agenda';
import Feedback from './pages/Feedback';
import Historico from './pages/Historico';

// Rota Protegida
function RotaProtegida({ children }) {
  const usuarioEstaLogado = localStorage.getItem('perfil') !== null;
  return usuarioEstaLogado ? children : <Navigate to="/login" />;
}

function App() {
  //  Verifica se o usuário está logado
  const usuarioLogado = localStorage.getItem('perfil') !== null;

  // Pega exatamente qual é o perfil da pessoa logada
  const perfilUsuario = localStorage.getItem('perfil'); 

  //  Função para deslogar 
  const fazerLogout = () => {
    // Usa o .clear() apaga tanto o perfil quanto o e-mail salvos
    localStorage.clear(); 
    window.location.href = '/'; 
  };

  return (
    <BrowserRouter>
      {/* Menu Superior Dinâmico */}
      <nav className="navbar">
        <NavLink to="/" className="nav-brand">Portal de Eventos</NavLink>
        <div className="nav-links">
          
          <NavLink to="/" className="nav-item" end>Início</NavLink>
          <NavLink to="/feedback" className="nav-item">Feedback</NavLink>

          {/* VISITANTES (NÃO LOGADOS) */}
          {!usuarioLogado && (
            <>
              <NavLink to="/cadastro-usuario" className="nav-item">Criar Conta</NavLink>
              <NavLink to="/login" className="nav-item">Entrar</NavLink>
            </>
          )}

          {/*  USUÁRIOS (LOGADOS)  */}
          {usuarioLogado && (
            <>
            {/*  ÁREA DO PARTICIPANTE */}
            <NavLink to="/agenda" className="nav-item">📅 Agenda de Eventos</NavLink>

            <NavLink to="/historico" className="nav-item">📚 Meu Histórico</NavLink>

              {/*O Painel só aparece se a palavra salva for ORGANIZADOR  */}
              {perfilUsuario === 'ORGANIZADOR' && (
                <NavLink to="/eventos" className="nav-item">⚙️ Painel do Organizador</NavLink>
              )}

              <button 
                onClick={fazerLogout} 
                className="nav-item" 
                style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer' }}
              >
                Sair
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Container Principal */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
          <Route path="/eventos" element={<RotaProtegida><CadastroEvento /></RotaProtegida>} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/historico" element={<RotaProtegida><Historico /></RotaProtegida>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;