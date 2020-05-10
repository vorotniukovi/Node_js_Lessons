module.exports = function(req,res,next){
    if(!req.session.isAuthindicated){
        return res.redirect('/auth/login')
    }
    next()
}