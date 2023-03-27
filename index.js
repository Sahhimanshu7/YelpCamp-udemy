const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/yelpCamp', { useNewUrlParser : true})
.then(()=>{
    console.log("Connection established to mongoose");
})
.catch(err => {
    console.log(err);
})

app.set('view engine', 'ejs');
app.set('views','views');

app.get('/',(req,res) => {
    res.send("This is homepage");
})

app.use(express.urlencoded({ extended : true }));
app.get('/register', (req,res)=>{
    res.render('register');
})

app.post('/register', async (req,res)=>{
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password,12);
    const user = new User({
        username,
        password:hash
    })
    await user.save();
    res.redirect('/');
})
app.get('/login', (req,res) => {
    res.render('login');
})
app.post('/login', async (req,res)=>{
    const { username, password } = req.body;
    const user = await User.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password);
    if(validPassword){
        res.send("Welcome")
    }
    else {
        res.send("Try again");
    }
})
app.get('/secret', (req,res) =>{
    res.send("This is secret!");
})

app.listen(3000, () => {
    console.log("Serving your app!");
})