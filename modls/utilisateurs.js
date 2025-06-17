const db=require("../config/db") //faire la connexion a la bd 

const Utilisateur={
    getAll:async()=>{
        const [rows]=await db.query("select * from utilisateurs")
        return rows
    },
    create:async(utilisateur)=>{
        const {nom,prenom,mail,mot_pass,diplome}=utilisateur
        const [result]=await db.query("INSERT INTO `utilisateurs`( `nom`, `prenom`, `mail`, `mot_pass`, `diplome`) VALUES (?,?,?,?,?)",[nom,prenom,mail,mot_pass,diplome])
        return result
    },
}

module.exports= Utilisateur