const express = require('express')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
const http = require('http')


//require models here
const User = require('./models/user')


//require routes here
const authRoutes = require('./routes/Auth')
const AddFriendsRoutes = require('./routes/add_Friends')


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

app.use(authRoutes)
app.use(AddFriendsRoutes)

app.get('/my_friend',(req,res)=>{
    console.log(req.user.friends)
    res.render('list_friends',{friends:req.user.friends})
})

app.post('/chats',(req,res)=>{
    res.render('chat',{username : "AAA",room :"javascript"})            //right now hardcoded but will change in future
})

//Server configuration 
PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`)
})