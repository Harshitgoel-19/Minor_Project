const mongoose=require('mongoose');
const Schema=mongoose.Schema


const questionSchema=new Schema({
    level: { type: Number, required: true},
    question: { type: String, required: true}
})

mongoose.set("strictQuery",false);


module.exports=mongoose.model('question', questionSchema) 