const express=require("express")

const router=express.Router()
const{getAlletudiants, getEtudiantById, getEtudiantByNom, getEtudiantByNiveau,updateEtudiant, getEtudiantBySession,createEtudiant}=require("../controllers/etudiantsController")

router.get('/',getAlletudiants)
router.get('/:id',getEtudiantById)
router.get("/nom/:nom",getEtudiantByNom)
router.get("/niveau/:niveau",getEtudiantByNiveau)
router.get("/session/:type_session",getEtudiantBySession)
router.post('/', createEtudiant);
router.put('/:id',updateEtudiant);


module.exports=router