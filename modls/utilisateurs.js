const db=require("../config/db") //faire la connexion a la bd 
const bcrypt=require("bcryptjs")

const Utilisateur={
    findBymail:async(email)=>{
        const [rows]=await db.query("SELECT * FROM utilisateurs WHERE mail = ?", [email])
        return rows [0]

    },

    getAll:async()=>{
        const [rows]=await db.query("select * from utilisateurs")
        return rows
    },
    create:async(utilisateur)=>{
        const {nom,prenom,mail,mot_pass,diplome,role = 'user' }=utilisateur
        const [result]=await db.query("INSERT INTO `utilisateurs`( `nom`, `prenom`, `mail`, `mot_pass`, `diplome`,`role`) VALUES (?,?,?,?,?,?)",[nom,prenom,mail,mot_pass,diplome,role])
        return result
    },
}

module.exports= Utilisateur