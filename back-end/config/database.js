const mongoose = require('mongoose');

const connectDB = () =>{
    mongoose.connect(process.env.DB_LOCAL_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex : true
    }).then(con =>{
        console.log(`MongoDB database connecte avec HOST : ${con.connection.host}`)
    })
}


module.exports = connectDB;