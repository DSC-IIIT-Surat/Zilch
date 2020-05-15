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


//add in diffrent file//------------------------------------------------------------------//

const users = []

function userJoin(id, username ,room){
    const user = {id , username , room}

    users.push(user)
    return user
}

//get current user
function getUser(id){
    return users.find(user => user.id === id)
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

function getUserRoom(room){
    return users.filter(user => user.room === room)
}

function formatMessage(username,text,time){           // get username , text and time from user and convert to object
    return {
        username,
        text,
        time,
    }
}

//till here//----------------------------------------------------------------------------------//


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);    

mongoose.connect("mongodb://localhost/Private_chats",(err,db)=>{            //connecting mongodb database
    if(err){
        console.log(err)
    }else{
        console.log("Db connected")

        io.on('connection',socket =>{

            socket.on('join-chat',({username ,room})=>{

                const user = userJoin(socket.id , username , room)

                socket.join(user.room)

                let chat = db.collection(room);

                chat.find().limit(100).sort({_id:1}).toArray((err,res)=>{
                    if(err){
                        console.log(err)
                    }
                    socket.emit("output",res)
                })
        
        
                socket.emit('message',formatMessage(botName,'Wellcome to Zilch!'," "))
        
                //when user connects
                socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`," "))
                console.log(user.room)
        
                //sending chat message
                socket.on('chatMessage',data=>{
                    const user = getUser(socket.id)

                    chat.insertOne({username: user.username, text: data.msg ,time : data.time}, function(){
                        io.to(user.room).emit('message',formatMessage(user.username,data.msg,data.time))
                    });

                })
        
                io.to(user.room).emit('sendUserData',{
                    room : user.room,
                    users : getUserRoom(user.room)
                })
        
                //when user disconnect
                socket.on('disconnect',data=>{
                    const user = userLeave(socket.id)
        
                    if(user){
                        io.to(user.room).emit('message',formatMessage(botName,`${user.username} left the chat`," "))
                        
                        io.to(user.room).emit('sendUserData',{
                            room : user.room,
                            users : getUserRoom(user.room)
                        })
                    }
        
                    
                })

                socket.on('clear',()=>{
                    chat.remove({},()=>{console.log("removed")})
                })

            })
        
        
        })
    }             
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