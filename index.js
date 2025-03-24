//configuration 
const express =require('express')
const mysql=require("mysql2")
const dotenv=require("dotenv")
const cors=require("cors")

// Charger les variables d'environnement
dotenv.config()



// Initialisation de l'application
const app=express()
const port =process.env.PORT || 3000
app.use(cors())
// Middleware pour gérer le JSON
app.use(express.json())

//connexion a la base de données
const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,

})

db.connect((err)=>{
    if(err){
        console.error("Erreur de connexion a la base de données ",err)
        process.exit(1)
    }
    console.log("Connecté a la base de données ")

})

//definire une route pour le test 

app.get("/",(req,res)=>{
    res.send("API Fonctionnelel !")
})




// Importer les routes
const utilisateurRoutes=require("./routes/utilisateursRoutes")
const etudiantRoute=require("./routes/etudiantRoutes")
const domaineRoute=require("./routes/domaineRoutes")
const niveauRoute=require("./routes/niveauRoutes")
const sessionRoute=require("./routes/sessionRoute")
const paiementRoute=require("./routes/paiementRoutes")

// Utiliser les routes
app.use('/api/utilisateurs',utilisateurRoutes)
app.use("/api/etudiants",etudiantRoute)
app.use("/api/domaines",domaineRoute)
app.use("/api/niveaux",niveauRoute)
app.use("/api/sessions",sessionRoute)
app.use("/api/paiement",paiementRoute)


//démarage du serveure

app.listen(port,()=>{
    console.log(`Serveur démarré sur  http://localhost:${port}`)
})
