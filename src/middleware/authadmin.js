const authadmin= async(req,res,next)=>{
    try{
        if(req.user.role!=="Admin") throw new Error()
        next()
    }
    catch(e){
        res.status(401).send({error:'You are not allowed'})
    }
}

module.exports=authadmin