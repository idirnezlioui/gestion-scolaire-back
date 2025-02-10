const db=require("../config/db")
const Etudiant={
    getAll :async()=>{
        const[rows]=await db.query("SELECT e.date_inse,e.sigle_specia,e.num_etudiant, e.nom,e.prenom,e.date_naiss,e.niveau,s.annee,s.type_session from etudiants as e  LEFT JOIN sessions as s ON e.id_session=s.id_session;")
        return rows
    },

    //Recupere un etudiant par sont id 
    getById:async(id)=>{
        const[rows]=await db.query("SELECT e.num_etudiant, e.nom, e.prenom, e.date_naiss, e.niveau, s.type_session FROM etudiants AS e LEFT JOIN sessions AS s ON e.id_session = s.id_session WHERE e.num_etudiant = ?;",
            [id])
        return rows.length>0? rows[0]:null
    },

    //recupere un etudiant par nom 
    getByNom:async(nom)=>{
        const[rows]=await db.query("SELECT e.num_etudiant, e.nom, e.prenom, e.date_naiss, e.niveau, s.type_session FROM etudiants AS e LEFT JOIN sessions AS s ON e.id_session = s.id_session WHERE e.nom LIKE ?;",
            [`%${nom}%`])
        return rows
    },

    //recuper un etudiants par niveau 
    getByNiveau:async(niveau)=>{
        const[rows]=await db.query("SELECT e.num_etudiant, e.nom, e.prenom, e.date_naiss, e.niveau, s.type_session FROM etudiants AS e LEFT JOIN sessions AS s ON e.id_session = s.id_session WHERE e.niveau = ?;",
            [niveau])
        return rows
    },

    //recupere un etudiant par type de session 

    getBySession:async(type_session)=>{
        const [rows]=await db.query("SELECT e.date_inse,e.sigle_specia,e.num_etudiant, e.nom,e.prenom,e.date_naiss,e.niveau,s.annee,s.type_session from etudiants as e JOIN sessions as s ON e.id_session=s.id_session where type_session=? ;",[type_session])
        return rows
    },

    //insertion de l'etudiant 
    create:async(etudiant)=>{
        const { nom, prenom, date_naiss, lieu_naiss, nationalite, niveau, date_inse, sigle_specia, type_session } = etudiant;
        //il faut d'abord recupere id session vue que l'utilisateur vas asiasire type-session
        try {
            //recupere id-session par rapport a son type 
            const [sessionResult]=await db.query("SELECT id_session FROM `sessions` WHERE type_session=?",[type_session])

            if (sessionResult.length ===0) {
                throw new Error("Type de session introvable")
            }
            
            const id_session=sessionResult[0].id_session

            //insertion de l'etudiant

            const [result]=await db.query(
                `INSERT INTO etudiants( nom, prenom, date_naiss, lieu_naiss, nationalite, niveau, date_inse, sigle_specia, id_session) VALUES(?,?,?,?,?,?,?,?,?)`,
                [nom,prenom,date_naiss,lieu_naiss,nationalite,niveau,date_inse,sigle_specia,id_session]
            )
            return {succes:true,message:"etudiant ajouter avec succe",id:result.insertId}
        } catch (error) {
            console.error("Erreure de lors de l'insertion de l'etudiant ",error.message)
            return {succes:false,message:error.message}
        }

    }
}

module.exports=Etudiant