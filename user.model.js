// Importa as bibliotecas necessárias
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define o Schema principal do Usuário
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do usuário é obrigatório.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true, // Garante que não haja dois usuários com o mesmo e-mail
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, forneça um e-mail válido.',
    ],
  },
  // Armazenamos apenas o hash da senha, nunca a senha em texto plano
  hashSenha: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    select: false, // Não retorna o hash da senha em consultas por padrão
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_POSTO', 'FRENTISTA', 'GESTOR_EMPRESA'], // Define os papéis permitidos
  },
  status: {
    type: String,
    required: true,
    enum: ['ATIVO', 'INATIVO'],
    default: 'ATIVO',
  },
  // Referência ao ID do documento na coleção 'postos'
  postoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posto', // O nome do modelo 'Posto'
    required: function() { return this.role === 'ADMIN_POSTO' || this.role === 'FRENTISTA'; }
  },
  // Referência ao ID do documento na coleção 'empresas'
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa', // O nome do modelo 'Empresa'
    required: function() { return this.role === 'GESTOR_EMPRESA'; }
  },
  /*
   * O campo 'profile' é do tipo 'Mixed', o que permite que sua estrutura
   * seja flexível e diferente para cada 'role', conforme planejamos.
   * A validação da estrutura do profile (ex: checar se um FRENTISTA tem CPF)
   * deve ser feita na lógica da sua aplicação (camada de serviço) antes de salvar.
  */
  profile: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
});

// Middleware (ou "hook") do Mongoose que é executado ANTES de um documento ser salvo
// Usamos isso para criptografar a senha automaticamente.
userSchema.pre('save', async function(next) {
  // Executa a função apenas se a senha foi modificada (ou é um novo usuário)
  if (!this.isModified('hashSenha')) return next();

  // Gera o "salt" e criptografa a senha com um custo de 12 (padrão de segurança)
  const salt = await bcrypt.genSalt(12);
  this.hashSenha = await bcrypt.hash(this.hashSenha, salt);

  next();
});

// Cria o Modelo 'User' a partir do schema definido
const User = mongoose.model('User', userSchema);

// Exporta o modelo para ser utilizado em outras partes da aplicação
module.exports = User;
