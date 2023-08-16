const userModel=require('../models/user')

module.exports.levelComplete=async(req,res)=>{
    let {score,level}=req.body
    // console.log(score)
    // console.log(level)
    req.session.user.score+=score
    req.session.save()
    // console.log(req.session.user.score)
    await userModel.updateOne({email: req.session.user.email},{level: req.session.user.level+1 , score: req.session.user.score},{$push:{pastScores:{score,date:Date.now(),level}}})
}

module.exports.goNext=(req,res)=>{
    if(req.body.step=='next'){
        req.session.user.level++;
        req.session.save()
    }
    return res.redirect('/');
}