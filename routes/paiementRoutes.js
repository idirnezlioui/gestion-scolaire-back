const express=require("express")

const router=express.Router()
const{gettAllPaiement,createPaiement}=require("../controllers/paiementController")
router.get('/',gettAllPaiement)
router.post('/ajouter',createPaiement)

router.get('/verifier-remise/:id', async (req, res) => {
    try {
        const idEtudiant = req.params.id;
        const aDejaRemise = await Paiment.verifierRemise(idEtudiant);
        res.status(200).json(aDejaRemise);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la vérification de la remise" });
    }
});

module.exports=router