const express = require('express');
const app = express();
const testRoutes = require('./routes/test');

app.use('/test', testRoutes);

app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});