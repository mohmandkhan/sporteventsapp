const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 8000;

//Choose env configuration if not on production
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//For sending requests from different devices
app.use(cors());

//For sending responses in JSON format
app.use(express.json());


/** Database connection starts */
try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("MongoDB connected!!!");
}catch(error){
    console.log(error)
}
/** Database connection ends */

app.use("/files", express.static(path.resolve(__dirname, "../files")));

//App to use routes
app.use(routes);

//App starts here
app.listen(PORT, ()=>{
    console.log('Listening on Port 8000');
})