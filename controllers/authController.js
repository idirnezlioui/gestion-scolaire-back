const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const Utilisateur=require("../modls/utilisateurs")
const secret = "SECRET_KEY";

exports.login = async (req, res) => {
  console.log("Tentative de login détectée !");
  const { mail, mot_pass } = req.body;

  try {
    const user = await Utilisateur.findBymail(mail);
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    const isMatch = await bcrypt.compare(mot_pass, user.mot_pass);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id_utilisateur,
        email: user.mail,
        role: user.role,
      },
      secret,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      utilisateur: {
        nom: user.nom,
        role: user.role,
        id: user.id_utilisateur,
      },
    });
  } catch (err) {
    console.error("Erreur login :", err.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST /utilisateurs
exports.registerUser = async (req, res) => {
  try {
    const { nom, prenom, mail, mot_pass, diplome } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_pass, salt);
    await Utilisateur.create({
      nom,
      prenom,
      mail,
      mot_pass: hashedPassword,
      diplome,
      role: "user" // automatiquement défini ici
    });
    res.status(201).json({ message: "Utilisateur ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout", error: err.message });
  }
};

// POST /admin
exports.registerAdmin = async (req, res) => {
  try {
    const { nom, prenom, mail, mot_pass, diplome } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_pass, salt);

    await Utilisateur.create({
      nom,
      prenom,
      mail,
      mot_pass: hashedPassword,
      diplome,
      role: "admin"
    });

    res.status(201).json({ message: "Admin ajouté avec succès" });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de l'ajout",
      error: err.message
    });
  }
};
