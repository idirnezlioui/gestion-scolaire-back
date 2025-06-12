const ProfModule=require("../modls/profmodules")

const gettAllProfmod=async(req,res)=>{
    try {
        const profModule=await ProfModule.getAll()
        res.status(200).json(profModule)
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la recupération des Profs et des modules et des niveaux"})
        
    }
}
const createAffectations = async (req, res) => {
  const { id_prof, modules, niveaux } = req.body;

  if (!id_prof || !modules || !niveaux || !modules.length || !niveaux.length) {
    return res.status(400).json({ error: "Données manquantes ou invalides" });
  }

  try {
    await Promise.all(
      modules.flatMap(mod =>
        niveaux.map(niv =>
          ProfModule   .createAffectation(id_prof, mod, niv)
        )
      )
    );
    res.status(201).json({ message: "Affectations enregistrées avec succès" });
  } catch (error) {
    console.error("Erreur insertion:", error);
    res.status(500).json({ error: "Erreur lors de l'insertion des affectations" });
  }
};

const getAffectationsByProf = async (req, res) => {
  const id_prof = req.params.id;

  try {
    const data = await ProfModule.getByProf(id_prof);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération affectations" });
  }
};

const deleteByModule = async (req, res) => {
  const { id_prof, ref_module } = req.body;
  if (!id_prof || !ref_module) return res.status(400).json({ error: "Paramètres manquants" });

  try {
    await ProfModule.deleteByModule(id_prof, ref_module);
    res.status(200).json({ message: "Tous les niveaux de ce module supprimés" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression module" });
  }
};

const deleteByNiveau = async (req, res) => {
  const { id_prof, id_niveau } = req.body;
  if (!id_prof || !id_niveau) return res.status(400).json({ error: "Paramètres manquants" });

  try {
    await ProfModule.deleteByNiveau(id_prof, id_niveau);
    res.status(200).json({ message: "Tous les modules pour ce niveau supprimés" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression niveau" });
  }
};

const addSingleAffectation = async (req, res) => {
  const { id_prof, ref_module, id_niveau } = req.body;

  if (!id_prof || !ref_module || !id_niveau) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    await ProfModule.createAffectation(id_prof, ref_module, id_niveau);
    res.status(201).json({ message: "Affectation ajoutée" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(200).json({ message: "Affectation déjà existante (ignorée)" });
    }
    console.error("Erreur insertion :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
const deleteSingle = async (req, res) => {
  const { id_prof, ref_module, id_niveau } = req.body;

  try {
    await ProfModule.deleteSingle({ id_prof, ref_module, id_niveau }); // ← ici la correction
    res.status(200).json({ message: 'Affectation supprimée' });
  } catch (error) {
    console.error('Erreur dans deleteSingle:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};





module.exports={gettAllProfmod ,createAffectations,getAffectationsByProf,deleteByModule,deleteByNiveau,addSingleAffectation,deleteSingle}