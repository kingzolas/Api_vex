// Importa o Express
const express = require('express');

// Importa a função de conexão com o banco de dados
const connectDB = require('./database'); // ajuste o caminho se estiver em outra pasta

// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Cria uma instância do app Express
const app = express();

// Conecta ao banco de dados
connectDB();

// --- CORREÇÃO APLICADA AQUI ---
// Middleware para parsear JSON no body das requisições
// Esta linha DEVE vir ANTES da definição das rotas.
app.use(express.json());

// Define as rotas da aplicação
const authRouter = require('./auth.routes');
app.use('/api/v1/auth', authRouter); // A rota será POST /api/v1/auth/login

// Exemplo de rota raiz
app.get('/', (req, res) => {
  res.send('API VEX rodando!');
});

// Define a porta (usa a variável de ambiente PORT ou 3000 por padrão)
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  const mode = process.env.NODE_ENV || 'development';
  console.log(`🚀 Servidor rodando na porta ${PORT} em modo ${mode.toUpperCase()}`);
});
