const express=require("express");
const path=require('path');
const mongoose=require('mongoose');
// const expresslayouts=require('express-ejs-layouts')
const app=express();
const session=require('express-session');
const MongoDBSession=require('connect-mongodb-session')(session);
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const userModel=require('./models/user')

mongoose.connect('mongodb://localhost:27017/typing-speed',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("Database Connected");
}).on('error',err=>{
    console.log("Connection Failed");
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const store=new MongoDBSession({
    uri: 'mongodb://localhost:27017/typing-speed',
    collection: 'sessions',
})
app.use(
    session({
        secret: "heufh489owehoewhvdl",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
)
const isAuth=(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login');
    }
}
const question=require("./models/question")
app.use('/public',express.static(__dirname+'/public'))
app.set('views',(path.join(__dirname,'views')))
app.set('view engine','ejs')
app.get('/',isAuth,async(req,res)=>{
    let problem=await question.findOne({level:req.session.user.level});
    res.render('index',{problem: problem})
})
app.get('/register',(req,res)=>{
    res.render('register',{mesg : ""});
})
app.get('/login',(req,res)=>{
    res.render('login',{mesg : ""});
})

app.post('/register',async (req,res)=>{
    const {username,email,password}=req.body
    let user=await userModel.findOne({email});
    if(user){
        const mesg = "Email already exists"
        return res.render('register',{mesg : mesg});
    }
    const hashedpassword=await bcrypt.hash(password,10);
    user = await userModel.create({
        username,
        email,
        password : hashedpassword
    });
    return res.redirect('/login');
})

app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    let user=await userModel.findOne({email});
    if(!user){
        const mesg = "Invalid Email/Password"
        return res.render('login',{mesg : mesg});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        const mesg = "Invalid Email/Password"
        return res.render('login',{mesg:mesg});
    }
    req.session.isAuth=true;
    req.session.user=user;
    return res.redirect('/');
})
app.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/login')
    })
})
app.post('/api/levelupdate',async(req,res)=>{
    let {score}=req.body
    console.log(score)
    req.session.user.score+=score
    req.session.save()
    console.log(req.session.user.score)
    await userModel.updateOne({email: req.session.user.email},{level: req.session.user.level+1 , score: req.session.user.score})
})
app.post('/levelup',(req,res)=>{
    if(req.body.step=='next'){
        req.session.user.level++;
        req.session.save()
    }
    return res.redirect('/');
})

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})