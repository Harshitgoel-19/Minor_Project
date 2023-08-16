const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const userModel=require('../models/user')

module.exports.registerGet=(req,res)=>{
    res.render('register',{mesg : ""});
}

module.exports.isAuthorised=(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/auth/login');
    }
}

module.exports.loginGet=(req,res)=>{
    res.render('login',{mesg : ""});
}

module.exports.registerPOST=async (req,res)=>{
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
    return res.redirect('/auth/login');
}

module.exports.loginPOST=async(req,res)=>{
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
}

module.exports.logout=(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/auth/login')
    })
}
