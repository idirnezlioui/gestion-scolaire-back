const db =require("../config/db");
const { update } = require("./domaine");


const Module={

    getAll: async () => {
        const [rows] = await db.query(`
          SELECT m.ref_module, m.intitule, m.nbr_heures, m.nbr_seances, m.type, d.intitule,m.ref_domaine AS domaine
          FROM modules m
          LEFT JOIN domaines d ON m.ref_domaine = d.ref_domainee  
        `);
        return rows;
    },

    create: async (module) => {
      const { intitule, nbr_heures, nbr_seances, type, domaine } = module;
    
      try {
        // domaine ici est déjà le ref_domaine
        const ref_domaine = domaine;
    
        const [result] = await db.query(
          `INSERT INTO modules (intitule, nbr_heures, nbr_seances, type, ref_domaine)
           VALUES (?, ?, ?, ?, ?)`,
          [intitule, nbr_heures, nbr_seances, type, ref_domaine]
        );
    
        return {
          succes: true,
          message: "Module ajouté avec succès",
          id: result.insertId,
        };
      } catch (error) {
        console.error("Erreur lors de l'insertion du module :", error.message);
        return { succes: false, message: error.message };
      }
    },

  update:async(ref_module,module)=>{
    const {intitule, nbr_heures, nbr_seances, type, domaine }=module

    try {
      const [result] = await db.query(
        `UPDATE modules SET intitule = ?, nbr_heures = ?, nbr_seances = ?, type = ?, ref_domaine = ?
         WHERE ref_module = ?`,
        [intitule, nbr_heures, nbr_seances, type, domaine, ref_module]
      );
      return{
        result,
        succes: true,
        message: "Module mis à jour avec succès",
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du module :", error.message);
      return { succes: false, message: error.message };
    }
  },

  delete:async(ref_module)=>{
    const[result]=await db.query(
      `DELETE FROM modules WHERE ref_module = ?`, [ref_module]
    )
    return result;
  }
    
      

}

module.exports=Module;