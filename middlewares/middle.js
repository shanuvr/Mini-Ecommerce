export function check(req,res,next){
    if(req.body.password && req.body.email){
        next()
    }else{
        res.json({message:"email and pass required"})
    }
}
