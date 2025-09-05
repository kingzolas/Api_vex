const express = require('express');
const { loginController, logoutController } = require('./auth.controller'); // Ajuste o caminho

const router = express.Router();

router.post('/login', loginController);
router.post('/logout', logoutController); // Se usar logout

module.exports = router;