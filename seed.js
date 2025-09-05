// Importa as bibliotecas necessárias
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Importa os modelos e a função de conexão que criamos
const connectDB = require('./database.js'); // Ajuste o caminho se necessário
const User = require('./user.model'); // Ajuste o caminho se necessário

// Configura o dotenv para carregar as variáveis de ambiente
dotenv.config();

/**
 * Função principal para popular o banco de dados com usuários de teste.
 * Esta função se conecta ao DB, apaga os usuários antigos e cria os novos.
 */
const seedUsers = async () => {
  try {
    // 1. Conecta ao banco de dados
    await connectDB();

    // 2. Apaga todos os usuários existentes para evitar duplicatas ao rodar o script várias vezes
    await User.deleteMany();
    console.log('Usuários antigos foram deletados...');

    // --- DADOS DE TESTE ---
    const mockPostoId = new mongoose.Types.ObjectId();
    const mockEmpresaId = new mongoose.Types.ObjectId();
    const senhaPadrao = 'senha123';

    // --- CORREÇÃO APLICADA AQUI ---
    // Usamos User.create() em um loop para garantir que o middleware 'pre-save' de hash seja ativado.

    // --- CONTA ADMIN DO POSTO ---
    await User.create({
      nome: 'Mariana Gestora (Admin)',
      email: 'admin.posto@vex.com',
      hashSenha: senhaPadrao,
      role: 'ADMIN_POSTO',
      status: 'ATIVO',
      postoId: mockPostoId,
      profile: {
        cargo: 'Proprietária',
        matricula: 'ADM-001',
        permissoes: {
          isOwner: true,
          podeGerenciarAdmins: true,
          podeGerenciarFrentistas: true,
          podeGerenciarContratos: true,
          podeVerDashboardFinanceira: true,
        },
      },
    });

    // --- CONTA FRENTISTA ---
    await User.create({
      nome: 'Carlos Silva (Frentista)',
      email: 'frentista.teste@vex.com',
      hashSenha: senhaPadrao,
      role: 'FRENTISTA',
      status: 'ATIVO',
      postoId: mockPostoId,
      profile: {
        cpf: '111.222.333-44',
        dataAdmissao: new Date('2023-01-15'),
        salarioRegistrado: 2350.0,
        turno: 'Diurno',
      },
    });

    // --- CONTA GESTOR DA EMPRESA CLIENTE ---
    await User.create({
      nome: 'Ana Clara (Cliente)',
      email: 'gestor.cliente@empresa.com',
      hashSenha: senhaPadrao,
      role: 'GESTOR_EMPRESA',
      status: 'ATIVO',
      empresaId: mockEmpresaId,
      profile: {
        cargoNaEmpresa: 'Diretora de Logística',
        departamento: 'Operações',
        permissoes: {
          isOwner: true,
          podeGerenciarGestores: true,
          podeGerenciarVeiculos: true,
          podeGerenciarMotoristas: true,
          podeVerFinanceiro: true,
        },
      },
    });


    console.log('===================================================');
    console.log('USUÁRIOS DE TESTE CRIADOS COM SUCESSO!');
    console.log('As senhas foram criptografadas corretamente.');
    console.log('===================================================');
    console.log('Admin do Posto:');
    console.log(`  Login: admin.posto@vex.com`);
    console.log(`  Senha: ${senhaPadrao}`);
    console.log('---------------------------------------------------');
    console.log('Frentista:');
    console.log(`  Login: frentista.teste@vex.com`);
    console.log(`  Senha: ${senhaPadrao}`);
    console.log('---------------------------------------------------');
    console.log('Gestor da Empresa Cliente:');
    console.log(`  Login: gestor.cliente@empresa.com`);
    console.log(`  Senha: ${senhaPadrao}`);
    console.log('===================================================');

    // 4. Encerra o processo com sucesso
    process.exit();
  } catch (error) {
    console.error('ERRO ao executar o script de seed:', error);
    process.exit(1);
  }
};

// Executa a função principal
seedUsers();
