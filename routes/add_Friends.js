var express = require('express')
var router = express.Router()
var User = require('./../models/user')
var passport = require('passport')


router.get('/addFriend',(req,res)=>{
    User.find({username : {$ne : req.user.username}},(err,data)=>{
      if (err) {
          console.log(err)
      } else {
        res.render("add_friend",{data : data})
      }  
    })
})

router.post('/make_friend',(req,res)=>{
    User.findOne({username : req.body.username},(err,data)=>{
        if(err){
            console.log(err)
        }else{
            console.log("current user : "+req.user.username)        //Just for debugging
            console.log("new user : "+data.username)                //Just for debugging

            //This one changes current user's Array
            User.updateOne({username : req.user.username},{
                $push:{
                    friends:data.username
                }
            },(err,r)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log(r)
                }
            })

            //This one change Friend's friend array
            User.updateOne({username : data.username},{
                $push:{
                    friends:req.user.username
                }
            },(err,r)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log(r)
                }
            })

            res.redirect('/')
        }
    })
})


module.exports = router