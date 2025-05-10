const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv').config();
const { deleteExpiredUrls } = require('./utils/UrlUtils');
const app = express();
app.use(express.json());
const cors = require('cors');

const urlRoutes = require('./routes/UrlRoutes');
app.use('/', urlRoutes);
app.use(cors());

const startServer = async () => {
    try {
        const host = process.env.MONGO_HOST;
        const username = process.env.MONGO_INITDB_ROOT_USERNAME;
        const password = process.env.MONGO_INITDB_ROOT_PASSWORD;

        await mongoose.connect(`mongodb://${username}:${password}@${host}:27017`);
        console.log('Connected to MongoDB with success');

        app.listen(8080, () => {
            console.log('Server is running in port 8080');
        });
    } catch (error) {
        console.error('Erro connecting to MongoDB:', error);
        process.exit(1);
    }
};
// Job that erases all expired urls every minute.
setInterval(() => {
    deleteExpiredUrls();
}, 1000 * 60 * 1);

startServer();