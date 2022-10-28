const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const { PORT } = require('./config/env');
const { initializeDatabase } = require('./config/database');
const { auth } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');

const routes = require('./routes');


const app = express();
require('./config/handlebars')(app);

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
app.use(cookieParser());
app.use(auth);
app.use(routes);
app.use(errorHandler);


initializeDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.log('Cannot connect to db:', err);
    });