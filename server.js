// Importaciones necesarias
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Configuración de Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = 'gpt-4';

// Ruta para el chat
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages,
                max_tokens: 600,
                temperature: 0.7
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al conectar con OpenAI' });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});