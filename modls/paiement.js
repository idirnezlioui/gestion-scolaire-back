const db = require("../config/db");

const Paiment = {
  // Récupérer tous les paiements
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT e.nom, e.prenom, p.montant_paye, p.date_paiement, p.date_max_paiement, p.solde_restant, p.statut_paiment, p.remise 
      FROM paiements AS p 
      LEFT JOIN etudiants AS e ON p.id_etudiant = e.num_etudiant;`
    );
    return rows;
  },

  // Récupérer le tarif de la formation
  // Récupérer le tarif de la formation
getTarif: async (id_etudiant) => {
  try {
    const [rows] = await db.query(
      `SELECT n.tarifs 
       FROM etudiants AS e
       LEFT JOIN niveau AS n ON e.id_niveau = n.id_niveau
       WHERE e.num_etudiant = ?`,
      [id_etudiant]
    );

    if (rows.length > 0) {
      return rows[0].tarifs; // Retourner le tarif si trouvé
    } else {
      throw new Error("Aucun tarif trouvé pour cet étudiant.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du tarif :", error.message);
    throw new Error("Impossible de récupérer le tarif de la formation.");
  }
},


  // Vérification si l'étudiant a déjà une remise
  verifierRemise: async (idEtudiant) => {
    const [rows] = await db.query(
      `SELECT remise FROM paiements WHERE id_etudiant = ? AND remise > 0 LIMIT 1`,
      [idEtudiant]
    );
    return rows.length > 0; // Retourne true si une remise existe
  },

  // Récupérer les paiements d'un étudiant par ID
  getPaiementsByEtudiant: async (id_etudiant) => {
    try {
      const [paiements] = await db.query(
        "SELECT * FROM paiements WHERE id_etudiant = ?",
        [id_etudiant]
      );
      return paiements;
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements de l'étudiant :", error);
      throw error;
    }
  },

  // Créer un nouveau paiement
  create: async (paiment) => {
    try {
      let { id_etudiant, montant_paye, date_paiement, date_max_paiement, remise } = paiment;

      // Récupérer le tarif de la formation
      const tarifformation = await Paiment.getTarif(id_etudiant);
      if (!tarifformation) {
        throw new Error("Impossible de récupérer le tarif de la formation");
      }

      // Vérifier si l'étudiant a déjà effectué un paiement
      const [rows] = await db.query(
        `SELECT COUNT(*) AS total, SUM(p.montant_paye) AS total_paye 
         FROM paiements AS p 
         WHERE p.id_etudiant = ?`,
        [id_etudiant]
      );

      const totalpaiments = rows[0].total;
      const totalpaye = rows[0].totalpaye || 0;

      // Vérification du premier paiement (doit être > 1800€)
      if (totalpaiments === 0 && montant_paye < 1800) {
        throw new Error("Le premier paiement doit être d’au moins 1800€");
      }

      // Vérification de la date du prochain paiement
      if (new Date(date_max_paiement) <= new Date(date_paiement)) {
        throw new Error("La date du prochain paiement doit être après la date actuelle");
      }

      // Calculer le solde restant
      let soldeRestant = tarifformation - (totalpaye + montant_paye + (remise || 0));

      // Déterminer le statut du paiement
      let statutPaiment = "En attente";
      if (totalpaiments === 0) {
        statutPaiment = "Partiel"; // Premier paiement -> passe en Partiel
      }
      if (soldeRestant <= 0) {
        statutPaiment = "Payé"; // Si solde = 0, paiement complet
        soldeRestant = 0;
      }

      // Insérer le paiement dans la base de données
      const [insertResult] = await db.query(
        `INSERT INTO paiements (id_etudiant, montant_paye, date_paiement, date_max_paiement, solde_restant, statut_paiment, remise) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id_etudiant,
          montant_paye,
          date_paiement,
          date_max_paiement,
          soldeRestant,
          statutPaiment,
          remise,
        ]
      );

      return { success: true, id_paiement: insertResult.insertId };

    } catch (error) {
      console.log("Erreur lors de l'ajout du paiement :", error.message);
      throw error;
    }
  },
};

module.exports = Paiment;
