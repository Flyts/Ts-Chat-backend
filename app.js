const express     = require('express'),
      mongoose    = require('mongoose'),
      app         = express()

mongoose.connect(
  "mongodb+srv://flyts:Samy2205@cluster0.jbgpvup.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(()  => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"))

app.use(express.json())

app.use((req, res, next)=>
{
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

  next()
})



module.exports = app
