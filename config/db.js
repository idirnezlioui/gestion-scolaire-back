const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();//charges tous les infos depuis le fichier .env


const db = mysql.createPool({
  //Un pool de connexions est un ensemble de connexions MySQL réutilisables. Cela améliore les performances, car une nouvelle connexion n'est pas recréée à chaque requête.
  host: process.env.DH_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


module.exports=db.promise();