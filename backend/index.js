const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// express set up..

const app = express();
app.use(express.json()); // just work like bodyParser. //recognize the incoming Request Object as a JSON Object. 
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`the server has started on port: ${PORT}` ));

// mongoose set up..

mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    {
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err) => {
        if(err) throw err;
        console.log("MongoDB connection established");
    }
);

// routes setup..
// middleware for the routes.
app.use("/users", require("./routes/userRoutes"));