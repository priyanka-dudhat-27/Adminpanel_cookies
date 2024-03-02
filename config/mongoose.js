const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1/gentelia_proj');
const db=mongoose.connection;
db.once('open',async(err)=>{
   if(err){
    console.log('wrong');
    return false;
   }
   else{
    console.log('db is connected!');
   }
})
module.exports=db;