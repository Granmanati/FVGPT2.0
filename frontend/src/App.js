import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import logo from './images/logoprueba.png';

function App() {
  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([
    { tipo: 'bot', texto: '¡Hola! Soy tu fisio digital. ¿Qué parte de tu cuerpo necesita atención hoy?' }
  ]);
  const [cargando, setCargando] = useState(false);
  const messagesEndRef = useRef(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversacion]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    setConversacion([...conversacion, { tipo: 'user', texto: mensaje }]);
    setCargando(true);

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje })
      });
      const data = await res.json();
      setConversacion(prev => [...prev, { tipo: 'bot', texto: data.respuesta }]);
    } catch (error) {
      console.error('Error:', error);
      setConversacion(prev => [...prev, { tipo: 'bot', texto: 'Lo siento, hubo un error al procesar tu mensaje.' }]);
    } finally {
      setMensaje('');
      setCargando(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="logo-container">
        <img src={logo} alt="Fisiovanguardia" className="logo" />
        <div className="status-indicator"></div>
      </div>
      <h2 className="chat-title">FisiovanguardiaGPT</h2>
      
      <div className="features">
        <button className="feature-btn">
          <i className="fas fa-video"></i> Video Call
        </button>
        <button className="feature-btn">
          <i className="fas fa-microphone"></i> Voice
        </button>
        <button className="feature-btn">
          <i className="fas fa-camera"></i> AR Scan
        </button>
      </div>

      <div className="messages" id="messages">
        {conversacion.map((msg, index) => (
          <div key={index} className={`bubble ${msg.tipo}`}>
            {msg.texto}
          </div>
        ))}
        {cargando && (
          <div className="bubble bot">
            Escribiendo...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={enviarMensaje} className="input-area">
        <input
          type="text"
          id="input"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje o usa el micrófono..."
          disabled={cargando}
        />
        <button type="submit" id="send" disabled={cargando || !mensaje.trim()}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>

      <footer className="footer">
        <a href="#"><i className="fas fa-shield-alt"></i> Privacidad</a>
        <span>Fisiovanguardia &copy; 2030</span>
        <a href="#"><i className="fas fa-question-circle"></i> Ayuda</a>
      </footer>
    </div>
  );
}

export default App;