const Domaine=require("../modls/domaine")

const gettAlldomaine=async(req,res)=>{
    try {
        const domaine=await Domaine.getAll()
        res.status(200).json(domaine)
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la recuperation des domaines"})
    }
}
module.exports={gettAlldomaine}