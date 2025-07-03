const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presenceController');

//Route spécifique D'ABORD
router.get('/seance-attendue/:num_etudiant/:ref_module', presenceController.getSeanceAttendue);

// Puis la route générique
router.get('/:niveau/:domaine', presenceController.getPresencesParNiveauDomaine);

router.post('/saisie', presenceController.saisirPresences);


module.exports = router;
