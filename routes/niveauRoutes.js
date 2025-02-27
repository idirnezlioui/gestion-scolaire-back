const express=require ("express")

const router=express.Router()

const {gettAllNiveau}=require("../controllers/niveauController")
router.get('/',gettAllNiveau)

module.exports=router
