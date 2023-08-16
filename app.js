const express=require("express");
const path=require('path');
const mongoose=require('mongoose');
// const expresslayouts=require('express-ejs-layouts')
const app=express();
const session=require('express-session');
const MongoDBSession=require('connect-mongodb-session')(session);
const bodyParser=require('body-parser');


const authRouter=require('./routes/authRoutes');
const levelRouter=require('./routes/levelRoutes');
const userRouter=require('./routes/userRoutes');
const authController = require('./controllers/authController');

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
// app.use()
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

app.use('/auth',authRouter);
app.use('/level',levelRouter);
app.use('/dashboard',userRouter);
const question=require("./models/question")
app.use('/public',express.static(__dirname+'/public'))
app.set('views',(path.join(__dirname,'views')))
app.set('view engine','ejs')


app.get('/',authController.isAuthorised,async(req,res)=>{
    let problem=await question.findOne({level:req.session.user.level});
    res.render('index',{problem: problem})
})

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})