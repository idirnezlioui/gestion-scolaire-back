const Etudiant=require("../modls/etudiant")

const getAlletudiants=async(req,res)=>{
    try {
        const etudiant=await Etudiant.getAll()
        res.status(200).json(etudiant)
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la récupération des étudiants"})

    }
}

const getEtudiantById =async(req,res)=>{
    try {
        const etudiant=await Etudiant.getById(req.params.id)
        if (!etudiant) {
            return res.status(404).json({error:"Etudiant non trouve"})
        }
        res.status(200).json({etudiant})
        
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la recupération de l'etudiant"})
    }
}

const getEtudiantByNom=async(req,res)=>{
    try {
        const etudiants=await Etudiant.getByNom(req.params.nom)
        if (etudiants.length ===0) {
            return res.status(404).json({error:"Aucun etudiant trouve avec se nom"})
        }
        res.status(200).json({etudiants})
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la recherche de l'etudiant"})
    }
}

const getEtudiantByNiveau=async(req,res)=>{
    try {
        const etudiants=await Etudiant.getByNiveau(req.params.niveau)
        if (etudiants.length === 0) {
            return res.status(404).json({error:"Aucun etudiant trouvé pour ce niveau"})
        }
        res.status(200).json({etudiants})
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la recuperation des etudiants par niveau"})
    }
}

const getEtudiantBySession=async(req,res)=>{
    try{
        const {type_session}=req.params
    if (!type_session) {
        return res.status(400).json({error:"le type de session est requi"})
    }


    const etudiants=await Etudiant.getBySession(type_session)
    if (etudiants.length === 0) {
        return res.status(404).json({error:"aucun etudiant trouvé pour cette session"})
    }
    res.status(200).json(etudiants)

    }
    catch(error){
        console.error("Erreure",error)
        res.status(500).json({error:"Erreure lors de la recuperation des etudiants par type de session"})

    }
    
}

const createEtudiant=async(req,res)=>{
    try {
        const newEtudiant=await Etudiant.create(req.body)
        if (!newEtudiant.succes) {
            return res.status(400).json({error:newEtudiant.message})
        }
        res.status(200).json({message:"Etudiant cree avec succe",newEtudiant})
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la creation de l'etudiant"})
    }
}
module.exports={getAlletudiants,createEtudiant,getEtudiantById,getEtudiantByNom,getEtudiantByNiveau,getEtudiantBySession}