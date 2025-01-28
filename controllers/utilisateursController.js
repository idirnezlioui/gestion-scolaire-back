const Utilisateur =require("../modls/utilisateurs")

const getAllutilisateurs=async(req,res)=>{
    try {
        const utilisateur=await Utilisateur.getAll()
        res.status(200).json(utilisateur)
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la récuperation des utilisateurs"})
    }
}

const createUtilisateur =async(req,res)=>{
    try {
        const newUser =await Utilisateur.create(req.body)
        res.status(201).json({message:"Utilisateur cree avec succès ",id:newUser.insertId})
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la creation de l'utilisateur" })
    }
}

module.exports={getAllutilisateurs,createUtilisateur}