const express=require("express")

const router=express.Router()
const{gettAlldomaine}=require("../controllers/domaineController")
router.get('/',gettAlldomaine)

module.exports=router