const { create } = require("../modls/etudiant");
const Paiment = require("../modls/paiement");

const gettAllPaiement = async (req, res) => {
  try {
    const paiment = await Paiment.getAll();
    res.status(200).json(paiment);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération de la liste des paiements",
    });
  }
};

// Fonction pour ajouter un paiement
const createPaiement = async (req, res) => {
  try {
    console.log("Données reçues par le backend :", req.body);

    // Vérification de la remise
    const { id_etudiant, montant_paye, remise, date_paiement, date_max_paiement } = req.body;
    const adejaRemise = await Paiment.verifierRemise(id_etudiant);
    if (adejaRemise && remise > 0) {
      return res.status(400).json({ error: "L'étudiant a déjà une remise" });
    }

    // Récupérer le tarif de la formation
    const tarifformation = await Paiment.getTarif(id_etudiant);
    if (!tarifformation) {
      console.log("Tarif récupéré :", tarifformation);
      return res
        .status(500)
        .json({ error: "Impossible de récupérer le tarif de la formation." });
    }

    // Vérifier si c'est le premier paiement de l'étudiant
    const paiements = await Paiment.getPaiementsByEtudiant(id_etudiant);
    const totalpaiments = paiements.length;
    const totalPaye = paiements.reduce((sum, p) => sum + p.montant_paye, 0);

    console.log('Le paiement est de ', montant_paye);
    if (totalpaiments === 0 && montant_paye < 1800) {
      return res
        .status(400)
        .json({ error: "Le premier paiement doit être d’au moins 1800€." });
    }

    // Vérifier la date du prochain paiement
    const datePaiement = new Date(date_paiement);
    const dateMaxPaiement = new Date(date_max_paiement);

    if (isNaN(datePaiement) || isNaN(dateMaxPaiement)) {
      return res.status(400).json({ error: "Les dates fournies sont invalides." });
    }

    if (dateMaxPaiement <= datePaiement) {
      return res
        .status(400)
        .json({
          error: "La date du prochain paiement doit être après la date actuelle.",
        });
    }

    // Calcul du solde restant
    let soldeRestant = tarifformation - (totalPaye + montant_paye + (remise || 0));

    // Définir le statut de paiement
    let statutPaiment = "En attente";
    if (totalpaiments === 0) {
      statutPaiment = "Partiel"; // Premier paiement -> passe en Partiel
    }
    if (soldeRestant <= 0) {
      statutPaiment = "Payé"; // Si solde = 0, paiement complet
      soldeRestant = 0;
    }

    // Ajouter les valeurs calculées dans req.body avant de les passer à Paiment.create
    req.body.solde_restant = soldeRestant;
    req.body.statut_paiment = statutPaiment;

    const result = await Paiment.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'insertion du paiement" });
  }
};

module.exports = { gettAllPaiement, createPaiement };
