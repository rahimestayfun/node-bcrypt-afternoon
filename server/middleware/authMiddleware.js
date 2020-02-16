module.exports = {
    usersOnly:(req,res,next)=>{
        if(!req.session.user){
            res.status(401).json('Please, log in')
        }
        next()
    },
    adminOnly: (req,res,next)=>{
        if(!req.session.user.isAdmin){
            res.status(403).json('You are not an admin!')
        }
        next();
    }
}