const express=require('express')
const { model } = require('mongoose')
const User= require('../models/user')
const auth= require('../middleware/auth')
const authadmin= require('../middleware/authadmin')


const router= new express.Router()

//ADMIN REGISTER
router.post('/admin/register',async(req,res)=>{
    const user= new User(req.body)
    console.log(user)
    try{
        await user.save()
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
    
})
//ADMIN LOGIN
router.post('/admin/login',async(req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email,req.body.password)
        const token= await user.generateAuthToken()
        res.send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})
//ADMIN PROFILE
router.get('/admin/me',auth,authadmin,async(req,res)=>{
    res.send(req.user)
})

//ADMIN PROFILE UPDATE
router.patch('/admin/me',auth,authadmin,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["name","email","password","Age"]
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
       return res.status(400).send({error:'Invalid update'})
    }

    try{
        
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(500).send()
    }
})

//CREATE RECRUITER

router.post('/admin/createrecruiter',auth,authadmin,async(req,res)=>{
     const user= new User({...req.body,role:"Recruiter"})
    try{
        await user.save()
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
    
})


//  GET ALL RECRUITERS
router.get('/admin/getrecruiters',auth,authadmin,async(req,res)=>{
    try{
        const recruiters=await User.find({role:"Recruiter"},null,{limit:req.query.limit,skip:req.query.skip})
            res.send(recruiters)

    }
    catch(e){
        res.status(500).send()
    }
    })


    //  GET ALL CLIENTS

    router.get('/admin/getclients',auth,authadmin,async(req,res)=>{
        try{
            const clients=await User.find({role:"Client"},null,{limit:req.query.limit,skip:req.query.skip})
            res.send(clients)
    
        }
        catch(e){
            res.status(500).send()
        }
        })

    //ADMIN LOGOUT

    router.post('/admin/logout',auth,authadmin, async(req,res)=>{
        try{
            req.user.tokens=req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })
            await req.user.save()
            res.send()
        }
        catch(e){
            res.status(500).send()
        }
    })


module.exports=router;