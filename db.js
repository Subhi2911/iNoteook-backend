const mongoose=require('mongoose');

const mongoURI="mongodb://localhost:27017/inotebook"

const connectToMongo=async()=>{
    try{
        await mongoose.connect(mongoURI)
            console.log("Connected to mongo successfully!")
        
    }
    catch(error){
        console.error("Failed to connect to mongo:", error);
    }
    
}

module.exports =connectToMongo;