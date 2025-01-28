const Etudiant=require("../modls/etudiant")

const getAlletudiants=async(req,res)=>{
    try {
        const etudiant=await Etudiant.getAll()
        res.status(200).json(etudiant)
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la récupération des étudiants"})

    }
}

module.exports={getAlletudiants}