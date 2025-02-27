const Session=require("../modls/session")

const gettAllSession=async(req,res)=>{
    try {
        const session=await Session.getAll()
        res.status(200).json(session)
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la recupération des sessions"})
        
    }
}

module.exports={gettAllSession}