const express=require("express")

const router=express.Router()
const{getAlletudiants}=require("../controllers/etudiantsController")
router.get('/',getAlletudiants)

module.exports=router