// Importa a biblioteca mongoose para interagir com o MongoDB
const mongoose = require('mongoose');

// Importa e configura a biblioteca 'dotenv' para carregar variáveis de ambiente
// de um arquivo .env para process.env
require('dotenv').config();

/**
 * Função assíncrona para conectar ao banco de dados MongoDB.
 * A função utiliza variáveis de ambiente para determinar qual string de conexão usar.
 */
const connectDB = async () => {
  try {
    // Seleciona a URI de conexão baseada no ambiente (NODE_ENV)
    // Se NODE_ENV for 'production', usa a string de produção, senão, a de desenvolvimento.
    const dbURI = process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI_PROD
      : process.env.MONGODB_URI_DEV;

    // Verifica se a URI do banco de dados foi definida no arquivo .env
    if (!dbURI) {
      console.error('ERRO: A URI do MongoDB não está definida no arquivo .env.');
      // Encerra o processo com um código de falha
      process.exit(1);
    }

    // Tenta conectar ao MongoDB usando a URI e as opções recomendadas
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB conectado com sucesso!');

  } catch (err) {
    // Se ocorrer um erro na conexão, exibe o erro no console
    console.error('ERRO ao conectar com o MongoDB:', err.message);
    // Encerra o processo com um código de falha
    process.exit(1);
  }
};

// Exporta a função de conexão para ser utilizada no arquivo principal da aplicação (ex: server.js)
module.exports = connectDB;

/*
 * =============================================================================
 * COMO USAR ESTE ARQUIVO
 * =============================================================================
 *
 * 1. Crie um arquivo chamado `.env` na raiz do seu projeto.
 *
 * 2. Copie o conteúdo abaixo para o seu arquivo `.env` e substitua pelos seus dados.
 *
 * # Arquivo .env
 *
 * # Define o ambiente da aplicação (development ou production)
 * NODE_ENV=development
 *
 * # String de conexão para o banco de dados de DESENVOLVIMENTO (local)
 * MONGODB_URI_DEV=mongodb://localhost:27017/vex-dev
 *
 * # String de conexão para o banco de dados de PRODUÇÃO (ex: MongoDB Atlas)
 * MONGODB_URI_PROD=mongodb+srv://<usuario>:<senha>@seucluster.mongodb.net/vex-prod?retryWrites=true&w=majority
 *
 * 3. No seu arquivo principal (ex: server.js ou app.js), importe e chame a função:
 *
 * const express = require('express');
 * const connectDB = require('./config/db'); // Ajuste o caminho se necessário
 *
 * // Conecta ao banco de dados
 * connectDB();
 *
 * const app = express();
 * // ... resto da sua configuração do servidor ...
 *
 * 4. Para rodar em produção, basta mudar a variável NODE_ENV no seu servidor para 'production'.
 *
 */
