const express = require("express")

const{getAllutilisateurs,createUtilisateur}=require("../controllers/utilisateursController")

const router=express.Router()

router.get('/',getAllutilisateurs)
router.post('/',createUtilisateur)

module.exports=router
