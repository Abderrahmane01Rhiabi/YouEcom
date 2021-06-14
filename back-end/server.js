const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');


//Handle uncaught exceptions -> server : off
process.on('uncaughtException', err =>{
    console.log(`ERROR : ${err.message}`);
    console.log(`Shutting down the server due to uncaught exceptions`); //?
    process.exit(1);
})


//Setting up config file
dotenv.config({path : 'back-end/config/config.env'})

//connecte avec database
connectDB();


const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server started on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
});
 
//Handle unhandled promise rejections (((mongodb => mongod)))
process.on('unhandledRejection', err =>{
    console.log(`ERROR : ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise rejection`); //?
    server.close(() => {
        process.exit(1);
    })
})

//difference entre devdepences et dépenses