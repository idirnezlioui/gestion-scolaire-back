const db=require("../config/db")

const Session={
    getAll:async()=>{
        const[rows]=await db.query("SELECT * FROM sessions as s ")
        return rows
    }
}

module.exports=Session