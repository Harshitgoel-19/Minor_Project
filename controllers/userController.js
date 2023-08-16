const userModel=require('../models/user')
const multer=require('multer')
const fs = require('fs')
const path = require('path');
const bcrypt= require('bcrypt')
const mailController=require('../controllers/mailController')


module.exports.userDashboard=async (req,res)=>{
    let alluser=userModel.find();
    // console.log(alluser);
    alluser=alluser.sort({"score":-1,"level":-1});
    let userarray=await alluser;
    let index;
    // console.log(userarray)
    userarray.find((user,i)=>{
        if(user.email===req.session.user.email){
            index = i;
            return true;
        }
        return false;
    })
    // console.log(index);
    userarray=userarray.map((user)=>{
        const a={
            username: user.username,
            score: user.score,
        }
        return a;
    })
    // console.log(userarray);
    res.render('user',{user: req.session.user, userarray:userarray, currentUserIndex:index});
}

module.exports.getupdateProfile=async (req,res)=>{
    res.render('updateProfile',{user: req.session.user, error: ''});
}
module.exports.updateProfile=async (req,res)=>{
    const username=req.body;
    await userModel.find(req.session.user)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
        let filename=`${Date.now()}_${file.originalname}`;
        req.filename=filename;
      cb(null, filename);
    }
  })
  
module.exports.upload = multer({ storage });
module.exports.checkFileExist=(req,res,next)=>{
    if(req.file) return next();
    res.render('updateProfile',{user: req.session.user, error: 'Please Select a Photo'})
}
  
module.exports.updateAvatar=async (req,res)=>{
    let imagePath="/public/images/"+req.filename;
    await userModel.findOneAndUpdate({email: req.session.user.email},{
        image: imagePath
    })
    let user=await userModel.findOne({email: req.session.user.email});
    req.session.user=user
    // console.log(user);
    // res.render('updateProfile',{user: user})
    res.redirect('/dashboard/update-profile')
}


module.exports.removeAvatar=async(req,res)=>{
    
    let pt = path.join(`${__dirname}/../`,req.session.user.image);
    console.log(pt);
    fs.unlink(pt,()=>console.log('file deleted'));
    const id = req.session.user._id;
    let user=await userModel.findByIdAndUpdate(id,{image:'/public/images/defaultUserIcon.png'})
    // console.log(user);
    user=await userModel.findById(id);
    // console.log(user);
    // console.log(req.session.user)
    req.session.user=user
    res.redirect('/dashboard/update-profile')
}

module.exports.getupdatePassword = async(req,res)=>{
    res.render('updatePassword',{mesg: ""});
}

module.exports.updatePassword = async(req,res,next)=>{
    const {currPassword,password,confirmPassword} = req.body;
    if(!currPassword || !password || !confirmPassword) return res.render('updatePassword',{mesg:"Please enter the password"});
    if(password != confirmPassword) return res.render('updatePassword',{mesg:"Password don't match"});

    const isMatch=await bcrypt.compare(currPassword,req.session.user.password);
    if(!isMatch){
        return res.render('updatePassword',{mesg:"Please enter correct password"});
    }

    const hashedpassword=await bcrypt.hash(password,10);
    await userModel.findByIdAndUpdate(req.session.user._id,{password:hashedpassword});
    //req.session.user.isAuth = false;
    //res.redirect('/auth/log');
    return next();
}

module.exports.getforgotPassword=(async(req,res)=>{
    let OTP = Math.floor((Math.random() * 899999) + 100000);
    console.log(OTP);
    mailController.sendEmail("Otp to Reset Password",req.session.user.email,OTP.toString());
    await userModel.updateOne({email: req.session.user.email},{otpData:{otp: OTP, otpExpire: Date.now()+600000}})
    res.render('forgotPassword',{mesg:""});
})

module.exports.forgotPassword=(async(req,res)=>{
    
})
