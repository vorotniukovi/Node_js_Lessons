const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_APIKEY}
}))

router.get('/login', async (req,res) => {
    res.render('auth/login',{
        title: 'Авторизация',
        isLogin: true,
        error: req.flash('error'),
        errorLogin: req.flash('error_login')
    })
})

router.get('/loguot', async (req,res) => {
    req.session.destroy(()=>{
        res.redirect('/auth/login#login')
    })

})

router.post('/login', async (req,res) =>{
    try {
        const {email,password} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            const crypPass = await bcrypt.compare(password,candidate.password)
            if(crypPass){
                req.session.user = candidate
                req.session.isAuthindicated = true
                req.session.save((err)=>{
                    if(err){
                        throw err
                    }else{
                        res.redirect('/')
                    }
                })
            }else{
                req.flash('error_login', 'Не верный пароль')
                res.redirect('/auth/login#login')
            }
        }else{
            req.flash('error_login', 'Не верный email')
            res.redirect('/auth/login#login')
        }
    }catch (e) {
        console.log(e)
    }



})

router.post('/register', async (req,res) =>{
    try {
        const {email,password,confirm,name}=req.body
        const candidate = await User.findOne({email})
        if(candidate){
            req.flash('error', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register')
        }else{
            const Hashpassword = await bcrypt.hash(password,10)
            const user = new User({
                email,name,password:Hashpassword,cart: {items:[]}
            })
           await user.save()
            res.redirect('/auth/login#login')
        }
    }catch (e) {
        console.log(e)
    }
    //res.redirect('/')
})
module.exports = router
