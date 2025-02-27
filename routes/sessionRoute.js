const express=require("express")

const router=express.Router()

const{gettAllSession}=require("../controllers/sessionController")
router.get('/',gettAllSession)

module.exports=router