require('dotenv').config();
const express = require("express");
const cors = require("cors");
const {notFound, errorHandler} = require("./app/middleware");

const app = express();

const corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = require("./app/models");
db.sequelize.sync();

app.use('/', require('./app/routes'))
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
