const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const exhrs = require('express-handlebars')
const mainRouter = require('./routes/home')
const cardRouter = require('./routes/card')
const varMiddelware = require('./middleware/var')
const userMiddelware = require('./middleware/user')
const coursesRouter = require('./routes/courses')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')
const addRouter = require('./routes/add')
const keys = require('./keys')
//const User = require('./models/user')


const app = express()
const PORT= process.env.PORT || 3000

const hbs = exhrs.create({
    defualtLayout: "main",
    extname: 'vorlis',

})
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
})
app.engine('vorlis',hbs.engine)
app.set('view engine','vorlis')
app.set('views','views')

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({'extended':true}))
app.use(session({
    secret: keys.SECRET_VALUE,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddelware)
app.use(userMiddelware)

app.use('/',mainRouter)
app.use('/courses',coursesRouter)
app.use('/add',addRouter)
app.use('/card',cardRouter)
app.use('/orders',ordersRouter)
app.use('/auth',authRouter)






async function start(){
    try {
        await mongoose.connect(keys.MONGODB_URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        app.listen(PORT,()=>{
            console.log(`Server start... on port ${PORT}`)
        })


    }catch(e){
        console.log(e)
    }

}
start()

