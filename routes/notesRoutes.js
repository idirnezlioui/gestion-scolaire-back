const express = require('express');
const router = express.Router();
const { getModulesByEtudiant } = require('../controllers/notesController');

router.get('/etudiants/:id/modules', getModulesByEtudiant);

module.exports = router;