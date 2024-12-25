const express = require('express'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const User = require('./models/user');
const session = require('express-session');

mongoose.connect('mongodb+srv://hassaanhaider5736:3Z4F9L2VPy99AzZA@cluster0.0p8bt.mongodb.net/?retryWrites=true&w=majority')

.then(()=>{
    console.log("database connected successfully")
})
.catch((error)=>{
    console.log("not connected")
    console.log(error)
})

app.set('view engine','ejs');
app.set('views','views');
app.use(express.urlencoded({extended:true}))
app.use(session({secret: 'notagoodsecret'}))

app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/register', async (req,res)=>{
    const {password,userName} = req.body;
    const hash = await bcrypt.hash(password,12);
    const user = new User({
        userName,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id
    res.redirect('/');

})
app.get('/', (req, res) => {
    res.send('this is home page');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async(req, res) => {
    const {userName , password} = req.body;
    const user = await User.findOne({userName});
    const validPassword =await bcrypt.compare(password, user.password);
    if(validPassword){
        req.session.user_id = user._id
        res.redirect('/secret')
    }
    else{
        res.redirect('/login')
    }
});
app.post('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
})
app.get('/secret', (req, res) => {
    if(!req.session.user_id){
        return res.redirect('/login')
    }
    res.render('secret')
});

app.listen(3000, () => {
    console.log("Server is running");
});
