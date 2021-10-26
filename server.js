const express = require('express');
const redis = require('redis');

const app = express()

const apiRoutes = require ('./routes/apiRoutes');
app.use('/api', apiRoutes);

app.listen(3000, () => { console.log('Server listening on port: ', 3000) });

