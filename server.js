import express from 'express';
import path from 'path';
import { Low } from 'lowdb'; // Import Low
import { JSONFile } from 'lowdb/node';
import studentRoutes from './routes/students.js';

const app = express();
const PORT = 3000;

// Caminho absoluto para o arquivo JSON
const dbFile = path.join(path.resolve(), 'db.json');

// Configuração do LowDB com JSONFile
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, {students: []});

// Inicializar o banco de dados com estrutura padrão
await db.read();
db.data ||= { students: [] }; // Inicializa com estrutura padrão se estiver vazio

// Middleware
app.use(express.json());

// Configuração das rotas da API
app.use('/api/students', studentRoutes(db));

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(path.resolve(), 'public')));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
