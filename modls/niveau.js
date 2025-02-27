const db=require("../config/db")

const Niveau={
    getAll:async()=>{
        const[rows]=await db.query("SELECT n.niveau FROM niveau as n")
        return rows
    }
}
module.exports=Niveau