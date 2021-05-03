const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

class Server {
    app = express();

    constructor() {
        this.setConfigurations();
        this.error404Handler();
        this.handleErrors();
    }

    setConfigurations(){
        this.configureBodyParser();
        this.crossOriginConnection();
    }

    configureBodyParser(){
        this.app.use(bodyParser.json({limit : "50mb"}));
        this.app.use(bodyParser.urlencoded({limit : "50mb", extended : true}));
    }

    crossOriginConnection(){
        const corsOptions = {
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
            allowedHeaders: ["Origin", "Content-Type", "Authorization", "X-Access-Token"],
            exposedHeaders: ["Content-Country"],
            credentials: true,
            optionsSuccessStatus: 200 
        };
        this.app.use(cors(corsOptions));
    }

    error404Handler(){
        this.app.use((req, res) => {
            res.status(404).send({message: "Not Found", status_code:404});
        });
    }

    handleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;

            res.status(errorStatus).json({
                message: error.message || "Something went wrong. Please try Again.",
                status_code: errorStatus
            });
        });
    }
}

module.exports = {
    Server
}
