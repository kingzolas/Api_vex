const User = require('./user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controller de login
const loginController = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      console.log(`[LOGIN FALHOU] Tentativa sem e-mail ou senha.`);
      return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
    }

    const user = await User.findOne({ email }).select('+hashSenha');

    if (!user || !(await bcrypt.compare(senha, user.hashSenha))) {
      console.log(`[LOGIN FALHOU] E-mail ou senha incorretos para o e-mail: ${email}`);
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    if (user.status !== 'ATIVO') {
      console.log(`[LOGIN FALHOU] Conta inativa para o usuário: ${email}`);
      return res.status(403).json({ message: 'Esta conta de usuário está inativa.' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        postoId: user.postoId,
        empresaId: user.empresaId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    console.log(`[LOGIN SUCESSO] Usuário logado: ${email} (ID: ${user._id}, Role: ${user.role})`);

    return res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        },
      },
    });

  } catch (error) {
    console.error('[ERRO SERVIDOR LOGIN]', error);
    return res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message });
  }
};

// Exemplo simples de logout (invalidar token no cliente é o normal, mas aqui só loga)
// Você pode ajustar para sua lógica real de logout se usar blacklist ou algo assim
const logoutController = (req, res) => {
  // Exemplo: pegar info do usuário do token (supondo middleware que já autenticou)
  const userEmail = req.user?.email || 'Usuário desconhecido';
  console.log(`[LOGOUT] Usuário desconectado: ${userEmail}`);
  res.status(200).json({ message: 'Logout efetuado com sucesso.' });
};

module.exports = { loginController, logoutController };
