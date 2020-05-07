const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',(req,res)=>{
    res.render("home")
})



PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`)
})