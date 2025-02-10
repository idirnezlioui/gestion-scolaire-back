const express=require("express")

const router=express.Router()
const{getAlletudiants,createEtudiant, getEtudiantById, getEtudiantByNom, getEtudiantByNiveau, getEtudiantBySession}=require("../controllers/etudiantsController")
router.get('/',getAlletudiants)
router.post('/',createEtudiant)
router.get('/:id',getEtudiantById)
router.get("/nom/:nom",getEtudiantByNom)
router.get("/niveau/:niveau",getEtudiantByNiveau)
router.get("/session/:type_session",getEtudiantBySession)

module.exports=router