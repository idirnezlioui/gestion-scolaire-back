const db=require("../config/db")
const Etudiant={
    getAll :async()=>{
        const[rows]=await db.query("SELECT * FROM etudiants")
        return rows
    }
}

module.exports=Etudiant