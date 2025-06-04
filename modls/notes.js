const db = require("../config/db");
const Notes = {
  getModulesByEtudiant: async (num_etudiant) => {
    const [rows] = await db.query(
      "SELECT * FROM modules_etudiant WHERE num_etudiant = ?",
      [num_etudiant]
    );
    return rows;
  },
};

module.exports = Notes;
