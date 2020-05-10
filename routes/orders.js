const {Router} = require('express')
const Order = require('../models/order')
const router = Router()
const auth = require('../middleware/auth')

router.get('/',auth, async (req,res) => {
    try {
        const orders = await Order.find({'user.userId' : req.user._id}).populate('user.userId')

        let wanted = orders.map(doc=>{
            return {
                name:doc.user.name,
                email:doc.user.userId.email,
                date: doc.date,
                id:doc._id,
                price: doc.courses.reduce((total,c)=>{
                    return total += c.count * c.course.price
                },0),
                courses: doc.courses.map(j =>{
                    return {
                        count: j.count,
                        title: j.course.title
                    }
                })
            }
        })
        //res.send(orders)
       // res.send(wanted)

        res.render('orders',{
            title: 'Заказы',
            isOrder: true,
            wanted
            /*orders: orders.map(o => {
                 return {
                     ...o._doc,
                     price: o.courses.reduce((total,c) =>{
                         return total += c.count * c.course.price
                     }, 0)


                 }
             })*/
         })
            //console.log(orders)
    }catch (e) {
       console.log(e)
    }

})

router.post('/', auth, async (req,res) =>{
    try{
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate()

        const courses = user.cart.items.map( i=>({
            count:i.count,
            course: {...i.courseId._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        })
        await order.save()
        await req.user.clearCart()
        res.redirect('/orders')
    }catch (e) {
        console.log(e)
    }
})

module.exports = router