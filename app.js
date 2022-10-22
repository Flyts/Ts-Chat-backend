const express     = require('express'),
      mongoose    = require('mongoose'),
      app         = express(),
      userRouter  = require("./routers/userRouter"),
      discussionRouter = require("./routers/discussionRouter"),
      messageRouter = require("./routers/messageRouter"),
      conversationRouter = require("./routers/conversationRouter"),
      passport    = require("passport"),
      bodyParser  = require("body-parser")
require("./config/passport")


if(process.env.NODE_ENV !== "production") 
{
  require('dotenv').config();
}

mongoose.connect(
  process.env.DATABASE_ACCESS,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(()  => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée"))

app.use((req, res, next)=>
{
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

  next()
})
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())


app.use("/api", userRouter)
// app.use("/api", passport.authenticate("jwt", {session: false}), discussionRouter)
app.use("/api", discussionRouter)
app.use("/api", messageRouter)
app.use("/api", conversationRouter)


module.exports = app
