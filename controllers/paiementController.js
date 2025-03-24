const { create } = require("../modls/etudiant");
const Paiment = require("../modls/paiement");

const gettAllPaiement = async (req, res) => {
  try {
    const paiment = await Paiment.getAll();
    res.status(200).json(paiment);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Erreure lors de la recuperation de la liste des paiements",
      });
  }
};


//fonction pour ajouter un paiement 
const createPaiement=async(req,res)=>{
    try {
        console.log("Données reçues par le backend :", req.body); 
       

        //verification de la remise
        const {id_etudiant,remise }=req.body
        const adejaRemise=await Paiment.verifierRemise(id_etudiant)
        if (adejaRemise && remise>0) {
            return res.status(400).json({error:"l'etudiant a deja une remise "})
        }
        const result=await Paiment.create(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({error:"erreurre lors de l'insertion de paiment "})
        
    }
}



module.exports = { gettAllPaiement,createPaiement };
