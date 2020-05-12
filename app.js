const express = require('express')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
const http = require('http')

const User = require('./models/user')


const app = express()
const server = http.createServer(app)        //server for app
const io = socketio(server)                 // server for socket.io

app.use(require('express-session')({
    secret : "Zilch is new chatting app",
    resave : false,
    saveUninitialized : false
}))

//passport configuration
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);    

mongoose.connect("mongodb://localhost/Private_chats",()=>{
    console.log("connected")                                    //connecting mongodb database
});



//Routes
app.get('/',(req,res)=>{
    res.render("home")
})

//Auth routes
app.get('/signin',(req,res)=>{
    res.render("signin")
})

app.post('/signin',(req,res)=>{

    username = req.body.username
    password = req.body.password
    User.register(new User({username : username}),password,(err,user)=>{
        if(err){
            console.log(err)
        }else{
            console.log(user)
        }
    })

    res.redirect('/')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login', passport.authenticate('local',{
    successRedirect : "/addFriend",
    failureRedirect : "/login"
}) ,(req,res)=>{
})

app.get('/addFriend',(req,res)=>{
    User.find({},(err,data)=>{
      if (err) {
          console.log(err)
      } else {
        res.render("add_friend",{data : data})
      }  
    })
})

app.post('/make_friend',(req,res)=>{
    User.findOne({username : req.body.username},(err,data)=>{
        if(err){
            console.log(err)
        }else{
            // Want to add user retrived here (Data) into current Users Friends array
            // We get Current User from req.user
            // Here we will add update query to update Friends Array of Current User 
            // and same for Friend's Friend Array
        }
    })
})


//Server configuration 
PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`)
})