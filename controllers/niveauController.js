const Niveau=require("../modls/niveau")

const gettAllNiveau=async(req,res)=>{
    try {
        const niveau=await Niveau.getAll()
        res.status(200).json(niveau)
        
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la recupérattion des Niveaux"})
    }
   

}
module.exports={gettAllNiveau}