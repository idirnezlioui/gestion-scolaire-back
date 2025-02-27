const db=require("../config/db")

const Domaine={
    getAll:async()=>{
        const[rows]=await db.query("SELECT d.intitule FROM `domaines` as d" )
        return rows
    }
}
module.exports=Domaine