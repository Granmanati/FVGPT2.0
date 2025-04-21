const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();

// Configuración de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Configuración de CORS
const allowedOrigins = [
    'http://localhost:3000',    // Frontend en desarrollo
    'https://fvgpt2.netlify.app'  // Frontend en producción
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('No permitido por CORS'));
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
}));

// Middleware para JSON
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend conectado correctamente' });
});

// Ruta principal del chat
app.post('/api/chat', async (req, res) => {
    try {
        const { mensaje } = req.body;

        if (!mensaje) {
            return res.status(400).json({ error: 'El mensaje es requerido' });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente experto en fisioterapia, trabajando para FisioVanguardia. Proporcionas información precisa y profesional sobre temas de fisioterapia y salud física."
                },
                {
                    role: "user",
                    content: mensaje
                }
            ],
            model: "gpt-3.5-turbo",
        });

        const respuesta = completion.choices[0].message.content;
        res.json({ respuesta });

    } catch (error) {
        console.error('Error en la API de OpenAI:', error);
        res.status(500).json({ 
            error: 'Error al procesar la solicitud',
            detalles: error.message 
        });
    }
});

// Ruta para historial (ejemplo)
app.get('/api/historial', (req, res) => {
    res.json({ message: 'Función de historial en desarrollo' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        detalles: err.message 
    });
});

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('Orígenes permitidos:', allowedOrigins);
});