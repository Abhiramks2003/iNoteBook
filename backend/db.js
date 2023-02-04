const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://abhiram2003:Abhiram%40mongodb2023@abhiram.4w9oeou.mongodb.net/iNoteBook?retryWrites=true&w=majority"
mongoose.set('strictQuery', false);
const connectToMongo = ()=>{
    mongoose.connect(mongoURL).then(()=>{
        console.log("connected to port 27017");
    }).catch((error)=>{
        console.log(error);
    })
}

module.exports = connectToMongo
