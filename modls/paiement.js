const db = require("../config/db");

const Paiment = {
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT e.nom, e.prenom, p.montant_paye, p.date_paiement, p.date_max_paiement, p.solde_restant, p.statut_paiment, p.remise 
            FROM paiements AS p 
            LEFT JOIN etudiants AS e ON p.id_etudiant = e.num_etudiant;`
        );
        return rows;
    },
    //verification de la remise 
    verifierRemise:async(idEtudiant)=>{
        const[rows]=await db.query(`SELECT remise FROM paiements WHERE id_etudiant = ? AND remise > 0 LIMIT 1`, [idEtudiant])
        return rows.length>0
    },

    create: async (paiment) => {
        try {
            let idEtudiant = paiment.id_etudiant;

            // Si l'utilisateur a saisi nom et prénom, récupérer l'ID correspondant
            if (!idEtudiant && paiment.nom && paiment.prenom) {
                const [rows] = await db.query(
                    `SELECT num_etudiant FROM etudiants WHERE nom = ? AND prenom = ?`, 
                    [paiment.nom, paiment.prenom]
                );

                if (rows.length === 0) {
                    throw new Error("Étudiant non trouvé avec ce nom et prénom");
                }
                idEtudiant = rows[0].num_etudiant;
            }

            // Vérification finale : un ID étudiant doit être trouvé
            if (!idEtudiant) {
                throw new Error("ID étudiant requis");
            }

            // Vérifier si l'étudiant existe bien dans la base de données
            const [etudiantExiste] = await db.query(
                `SELECT * FROM etudiants WHERE num_etudiant = ?`, 
                [idEtudiant]
            );

            if (etudiantExiste.length === 0) {
                throw new Error("Étudiant avec cet ID non trouvé");
            }

            // Insérer le paiement
            const [insertResult] = await db.query(
                `INSERT INTO paiements (id_etudiant, montant_paye, date_paiement, date_max_paiement, solde_restant, statut_paiment, remise) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    idEtudiant,
                    paiment.montant_paye,
                    paiment.date_paiement,
                    paiment.date_max_paiement,
                    paiment.solde_restant,
                    paiment.statut_paiment,
                    paiment.remise
                ]
            );

            return { success: true, id_paiement: insertResult.insertId };

        } catch (error) {
            console.log("Erreur lors de l'ajout du paiement :", error.message);
            throw error;
        }
    }


    

    
};

module.exports = Paiment;
