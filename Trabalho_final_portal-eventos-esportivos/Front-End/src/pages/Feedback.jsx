import { useState } from 'react';
import axios from 'axios';

export default function Feedback() {
    // Aqui eu implementei uma pequena inteligência de usabilidade:
    // Se a pessoa já fez login, eu pego o e-mail dela do localStorage.
    // Se for um visitante anônimo, eu inicio a variável vazia ('').
    const emailSalvo = localStorage.getItem('emailUsuario') || '';

    // Crio os estados do formulário. Note que o 'email' já inicia preenchido se o usuário estiver logado!
    const [email, setEmail] = useState(emailSalvo);
    const [assunto, setAssunto] = useState('');
    const [mensagem, setMensagem] = useState('');

    // Função disparada quando o usuário clica em "Enviar Mensagem"
    const handleEnviarSuporte = async (e) => {
        // Bloqueio o recarregamento padrão da página
        e.preventDefault();
        
        try {
            // Faço uma requisição POST para a minha API Java, enviando o JSON com os dados do feedback
            await axios.post('http://localhost:8080/api/suporte', {
                email, assunto, mensagem
            });
            alert('Sua mensagem foi enviada com sucesso! 🚀 Nossa equipe analisará em breve.');
            
            // Após enviar, eu limpo os campos do formulário para dar um feedback visual de que deu certo.
            setAssunto('');
            setMensagem('');
            
        } catch (erro) {
            console.error("Erro ao enviar suporte:", erro);
            alert('Não foi possível enviar a mensagem no momento. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
            <div className="card">
                <h2 style={{ color: '#2c3e50', marginBottom: '15px', textAlign: 'center' }}>
                    Central de Suporte & Feedback
                </h2>
                <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px', fontSize: '0.95rem' }}>
                    Teve algum problema, dúvida ou quer deixar uma sugestão para o Portal? Envie uma mensagem para nós!
                </p>

                {/* Vinculo o envio do formulário à minha função handleEnviarSuporte */}
                <form onSubmit={handleEnviarSuporte} className="form-group">
                    <input
                        type="email"
                        placeholder="Seu E-mail de contato"
                        className="input-field"
                        // O valor é controlado pelo React
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    {/* Usei um select para padronizar os assuntos e facilitar a triagem lá no Back-End */}
                    <select
                        className="input-field"
                        value={assunto}
                        onChange={(e) => setAssunto(e.target.value)}
                        required
                    >
                        <option value="">Selecione o Assunto</option>
                        <option value="Dúvida Geral">Dúvida Geral</option>
                        <option value="Problema Técnico">Problema Técnico (Bug)</option>
                        <option value="Sugestão de Melhoria">Sugestão de Melhoria</option>
                        <option value="Elogio">Elogio</option>
                        <option value="Outros">Outros</option>
                    </select>

                    <textarea
                        placeholder="Descreva sua dúvida, problema ou feedback com o máximo de detalhes..."
                        className="input-field"
                        rows="6"
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        required
                    />
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        Enviar Mensagem
                    </button>
                </form>
            </div>
        </div>
    );
}