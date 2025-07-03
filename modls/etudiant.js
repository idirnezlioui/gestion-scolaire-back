const db=require("../config/db")
const Etudiant={
    getAll :async()=>{
        const[rows]=await db.query(`
           SELECT e.num_etudiant,e.nom,e.prenom,e.nationalite,e.email ,e.numero_telephone ,n.niveau,d.intitule,s.type_session ,DATE_FORMAT(e.date_inse, '%d/%m/%Y') AS date_inse FROM etudiants as e LEFT JOIN niveau as n on e.id_niveau=n.id_niveau LEFT JOIN domaines as d on e.id_domaine=d.ref_domaine LEFT JOIN sessions as s on e.id_session=s.id_session;
        `);
        return rows
    },

    //Recupere un etudiant par sont id 
   getById: async (id) => {
  const [rows] = await db.query(
    `SELECT 
      e.num_etudiant, e.nom, e.prenom, e.date_naiss, e.lieu_naiss, e.nationalite,
      n.niveau, s.type_session,
      d.intitule AS intitule_domaine,
      DATE_FORMAT(e.date_inse, '%Y-%m-%d') as date_inse
    FROM etudiants AS e
    LEFT JOIN sessions AS s ON e.id_session = s.id_session
    LEFT JOIN niveau AS n ON e.id_niveau = n.id_niveau
    LEFT JOIN domaines AS d ON e.id_domaine = d.ref_domaine
    WHERE e.num_etudiant = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
},


    //recupere un etudiant par nom 
    getByNom:async(nom)=>{
        const[rows]=await db.query("SELECT e.num_etudiant, e.nom, e.prenom, e.date_naiss, n.niveau, s.type_session FROM etudiants AS e left join niveau as n on e.id_niveau=n.id_niveau LEFT JOIN sessions AS s ON e.id_session = s.id_session WHERE e.nom LIKE ?;",
            [`%${nom}%`])
        return rows
    },

    //recuper un etudiants par niveau 
    getByNiveau:async(niveau)=>{
        const[rows]=await db.query("SELECT e.num_etudiant, e.nom, e.prenom, e.date_naiss, e.niveau, FROM etudiants AS e LEFT JOIN niveu AS n ON e.id_niveu = n.id_niveau WHERE e.niveau = ?;",
            [niveau])
        return rows
    },

    //recupere un etudiant par type de session 

    getBySession:async(type_session)=>{
        const [rows]=await db.query("SELECT e.date_inse,e.sigle_specia,e.num_etudiant, e.nom,e.prenom,e.date_naiss,e.niveau,s.annee,s.type_session from etudiants as e JOIN sessions as s ON e.id_session=s.id_session where type_session=? ;",[type_session])
        return rows
    },

    //insertion de l'etudiant 
    create:async(etudiant,id_utilisateur)=>{
        const { nom, prenom, date_naiss, lieu_naiss, nationalite,email, numero_telephone, niveau, date_inse, type_session ,intitule_domaine} = etudiant;
        

        const year = new Date(date_inse).getFullYear().toString().slice(-2);
        // Compter combien d’étudiants existent déjà pour la même année
        const [countRows] = await db.query(
          `SELECT COUNT(*) AS count FROM etudiants WHERE num_etudiant LIKE ?`,
         [`${year}188%`]
        );
        const currentCount = countRows[0].count + 1; // +1 pour le prochain numéro
        const numEtudiant = `${year}188${currentCount}`;
        //il faut d'abord recupere id session vue que l'utilisateur vas asiasire type-session
        try {
            //recupere l'id du domaine depuis sont intitule
            const [domaineResult] = await db.query("SELECT ref_domaine FROM domaines WHERE intitule = ?", [intitule_domaine]);
            if (domaineResult.length===0) {
                console.log(domaineResult)
                throw new Error("Domane introuvable");
                
            }
            const id_domaine=domaineResult[0].ref_domaine


            //recupere id_nivaus depuis niveau 
            const [niveauResult]=await db.query("select id_niveau from niveau where niveau =?",[niveau])
            if (niveauResult.length===0) {
                throw new Error("niveau introuvable");
                
            }
            const id_niveau=niveauResult[0].id_niveau

            //recupere id-session par rapport a son type 
            const [sessionResult]=await db.query("SELECT id_session FROM `sessions` WHERE type_session=?",[type_session])

            if (sessionResult.length ===0) {
                throw new Error("Type de session introvable")
            } 
            
            const id_session=sessionResult[0].id_session 

            //insertion de l'etudiant

            const [result] = await db.query(
  `INSERT INTO etudiants(num_etudiant, nom, prenom, date_naiss, lieu_naiss, nationalite, email, numero_telephone, id_domaine, id_niveau, id_session, date_inse, id_utilisateur)  
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [numEtudiant, nom, prenom, date_naiss, lieu_naiss, nationalite, email, numero_telephone, id_domaine, id_niveau, id_session, date_inse, id_utilisateur]
);
            return {succes:true,message:"etudiant ajouter avec succe",id:result.insertId}
        } catch (error) {
            console.error("Erreure de lors de l'insertion de l'etudiant ",error.message)
            return {succes:false,message:error.message}
        }

    },

    update: async (id, etudiant) => {
  const {
    nom,
    prenom,
    date_naiss,
    lieu_naiss,
    nationalite,
    niveau,
    date_inse,
    type_session,
    intitule_domaine,
    email, 
    numero_telephone
  } = etudiant;

  try {
    // récupérer les IDs liés
    const [domaineResult] = await db.query(
      "SELECT ref_domaine FROM domaines WHERE intitule = ?",
      [intitule_domaine]
    );
    if (domaineResult.length === 0) throw new Error("Domaine introuvable");

    const [niveauResult] = await db.query(
      "SELECT id_niveau FROM niveau WHERE niveau = ?",
      [niveau]
    );
    if (niveauResult.length === 0) throw new Error("Niveau introuvable");

    const [sessionResult] = await db.query(
      "SELECT id_session FROM sessions WHERE type_session = ?",
      [type_session]
    );
    if (sessionResult.length === 0) throw new Error("Session introuvable");

    const id_domaine = domaineResult[0].ref_domaine;
    const id_niveau = niveauResult[0].id_niveau;
    const id_session = sessionResult[0].id_session;

    // mise à jour
    await db.query(
      `UPDATE etudiants 
       SET nom=?, prenom=?, date_naiss=?, lieu_naiss=?, nationalite=?, email=?, numero_telephone=? 
           id_domaine=?, id_niveau=?, id_session=?, date_inse=? 
       WHERE num_etudiant=?`,
      [
        nom,
        prenom,
        date_naiss,
        lieu_naiss,
        nationalite,
        email, 
        numero_telephone,
        id_domaine,
        id_niveau,
        id_session,
        date_inse,
        id,
      ]
    );

    return { succes: true, message: "Étudiant mis à jour avec succès" };
  } catch (error) {
    console.error("Erreur update :", error.message);
    return { succes: false, message: error.message };
  }
},
getSeancesByNiveauEtDomaine: async (niveau, domaine) => {
  // 1) Récupération des étudiants avec modules et nombre de séances
  const [rows] = await db.query(`
    SELECT 
      e.num_etudiant,               
      e.nom, 
      e.prenom, 
      d.intitule AS domaine,
      m.nbr_seances AS nombre_seance,
      m.ref_module,
      m.intitule
    FROM etudiants e
    JOIN niveau n ON e.id_niveau = n.id_niveau
    JOIN domaines d ON e.id_domaine = d.ref_domaine
    JOIN modules m ON m.ref_domaine = d.ref_domaine
    WHERE n.niveau = ? AND d.intitule = ?
    GROUP BY e.num_etudiant, e.nom, e.prenom, d.intitule, m.ref_module
    ORDER BY d.intitule, e.nom
  `, [niveau, domaine]);

  if (rows.length === 0) return [];

  // 2) Récupération des séances déjà renseignées
  const etudiantIds = rows.map(r => r.num_etudiant);
  const moduleIds = rows.map(r => r.ref_module);

  const [seances] = await db.query(`
    SELECT num_etudiant, ref_module, date_seance
    FROM presence
    WHERE num_etudiant IN (?) AND ref_module IN (?)
  `, [etudiantIds, moduleIds]);

  // 3) Création d'une table de correspondance étudiant+module → séances
  const seancesMap = {};
  seances.forEach(s => {
    const key = `${s.num_etudiant}_${s.ref_module}`;
    if (!seancesMap[key]) seancesMap[key] = [];
    seancesMap[key].push(s.date_seance);
  });

  // 4) Ajout des séances renseignées à chaque étudiant
  const result = rows.map(e => {
    const key = `${e.num_etudiant}_${e.ref_module}`;
    return {
      ...e,
      seancesRenseignees: seancesMap[key] || [],
    };
  });

  return result;
},





}

module.exports=Etudiant