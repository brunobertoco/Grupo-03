import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function CadastroUsuario() {
    // Crio os estados para capturar em tempo real o que o usuário digita nos campos
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    
    // Crio um estado para o perfil e já defino o padrão como 'PARTICIPANTE' para facilitar o uso comum
    const [perfil, setPerfil] = useState('PARTICIPANTE'); 
    
    // Uso o hook do React Router para poder redirecionar o usuário entre as páginas via código
    const navigate = useNavigate();

    // Esta é a função acionada quando o usuário clica em "Cadastrar"
    const handleCadastro = async (e) => {
        // Bloqueio o comportamento padrão do navegador de recarregar a página ao enviar o form
        e.preventDefault();
        
        try {
            // Faço uma requisição POST para a minha API Java, enviando o e-mail, senha e o perfil escolhido
            await axios.post('http://localhost:8080/api/auth/cadastro', { email, senha, perfil });
            
            // Se o Java retornar sucesso, aviso o usuário e mando ele direto para a tela de login
            alert('Conta criada com sucesso! Faça seu Login.');
            navigate('/login');
            
        } catch (erro) {
            console.error(erro);
            // Se o Java retornar um erro (ex: e-mail já existe no banco), o código cai aqui e avisa o usuário
            alert('Erro: Talvez esse e-mail já esteja em uso!');
        }
    };

    return (
        <div className="card">
            <h2>Criar Nova Conta</h2>
            
            {/* Vinculo o envio do formulário à minha função handleCadastro */}
            <form onSubmit={handleCadastro} className="form-group">
                <input 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    className="input-field"
                    value={email} 
                    // Atualizo o estado do e-mail a cada tecla pressionada
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Crie uma senha forte" 
                    className="input-field"
                    value={senha} 
                    // Atualizo o estado da senha a cada tecla pressionada
                    onChange={(e) => setSenha(e.target.value)} 
                    required 
                />
                
                {/* Uso um select simples para o usuário definir se é apenas um atleta ou um organizador */}
                <select 
                    className="input-field" 
                    value={perfil} 
                    onChange={(e) => setPerfil(e.target.value)} 
                    required
                >
                    <option value="PARTICIPANTE">Sou Participante</option>
                    <option value="ORGANIZADOR">Sou Organizador de Eventos</option>
                </select>

                <button type="submit" className="btn btn-success">
                    Cadastrar
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                {/* Link rápido para quem clicou em cadastrar e já tem conta */}
                Já tem uma conta? <Link to="/login" className="text-link">Faça Login aqui</Link>
            </p>
        </div>
    );
}