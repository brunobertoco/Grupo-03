import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

export default function Login() {
    // Aqui eu crio os estados que vão capturar e guardar em tempo real o que o usuário digitar nos campos
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    // Essa é a função principal disparada quando o usuário clica no botão "Entrar"
    const handleLogin = async (e) => {
        // O preventDefault bloqueia o comportamento padrão do HTML de recarregar a página inteira ao enviar o formulário
        e.preventDefault(); 
        
        try {
            // Aqui eu envio o e-mail e a senha digitados lá para a minha API em Java validar
            const resposta = await axios.post('http://localhost:8080/api/auth/login', { email, senha });
            alert('Login efetuado com sucesso!');

            // Se o Java aprovar, ele me devolve o perfil do usuário (se é ORGANIZADOR ou PARTICIPANTE).
            // Eu pego esse perfil e o e-mail e salvo no "localStorage" do navegador. 
            // É assim que o meu sistema inteiro sabe quem está navegando e o que ele tem permissão para ver.
            localStorage.setItem('perfil', resposta.data.perfil);
            localStorage.setItem('emailUsuario', email); 
            
            // Depois de salvar os dados da sessão, eu redireciono o usuário de volta para a Home Page
            window.location.href = '/';

        } catch (erro) {
            // Se o Java retornar o erro 401 (Não Autorizado), o código cai aqui e eu aviso o usuário
            console.error(erro);
            alert('Erro: Usuário ou senha incorretos!');
        }
    };

    return (
        <div className="card">
            <h2>Acesso ao Sistema</h2>
            
            {/* O onSubmit liga o formulário inteiro à minha função handleLogin */}
            <form onSubmit={handleLogin} className="form-group">
                <input 
                    type="email" 
                    placeholder="E-mail" 
                    className="input-field"
                    value={email}
                    // O onChange atualiza a variável "email" a cada letra que o usuário digita
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Senha" 
                    className="input-field"
                    value={senha}
                    // Mesma coisa aqui: a variável "senha" é atualizada em tempo real
                    onChange={(e) => setSenha(e.target.value)} 
                    required 
                />
                <button type="submit" className="btn btn-primary">
                    Entrar
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                {/* Um link rápido usando o React Router para mandar o visitante para a tela de registro, caso não tenha conta */}
                Ainda não tem conta? <Link to="/cadastro-usuario" className="text-link">Cadastre-se</Link>
            </p>
        </div>
    );
}