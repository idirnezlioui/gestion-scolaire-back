const Notes = require('../modls/notes');

const getModulesByEtudiant = async (req, res) => {
  const { id } = req.params;
  try {
    const modules = await Notes.getModulesByEtudiant(id);
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des modules" });
  }
};

module.exports = { getModulesByEtudiant };
