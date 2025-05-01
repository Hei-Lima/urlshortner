const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
app.use(express.json());

const urlRoutes = require('./routes/UrlRoutes');
app.use('/', urlRoutes);

const startServer = async () => {
    try {
        const username = process.env.MONGO_INITDB_ROOT_USERNAME;
        const password = process.env.MONGO_INITDB_ROOT_PASSWORD;

        await mongoose.connect(`mongodb://${username}:${password}@127.0.0.1:27017`);
        console.log('Connected to MongoDB with success');

        app.listen(8080, () => {
            console.log('Server is running in port 8080');
        });
    } catch (error) {
        console.error('Erro connecting to MongoDB:', error);
        process.exit(1);
    }
};

startServer();