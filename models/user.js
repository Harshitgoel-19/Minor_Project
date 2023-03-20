const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    level:{
        type: Number,
        required: true,
        default: 1
    },
    score:{
        type: Number,
        required: true,
        default: 0
    },
    image:{
        type: String,
        
    }
})

mongoose.set("strictQuery",false);
 
module.exports=mongoose.model('user',userSchema);