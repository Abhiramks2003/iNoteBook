const mongoose = require("mongoose");
const mongoURL = "mongodb://localhost:27017/iNoteBook"
mongoose.set('strictQuery', false);
const connectToMongo = ()=>{
    mongoose.connect(mongoURL,()=>{
        console.log("connected to port 27017");
    })
   
}

module.exports = connectToMongo
