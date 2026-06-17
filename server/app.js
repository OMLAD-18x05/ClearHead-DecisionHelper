require('dotenv').config()
const express = require("express");
const app = express();
app.use(express.json());

const { error } = require('./middleware/error.middleware')

// export routes
const authroutes = require('./routes/authentication/auth.routes');
const decisionroutes = require('./routes/decision/decision');
const optionsroutes = require('./routes/option/option');
const criteriaroutes = require('./routes/criteria/criteria');
const scoreroutes = require('./routes/score/score');
const { prisma } = require('./utils/dependencies');

// routing app
app.use('/auth', authroutes);
app.use('/api/', decisionroutes);
app.use('/api/decisions', optionsroutes);
app.use('/api/decisions', criteriaroutes);
app.use('/api/decisions', scoreroutes);

//error handling middleware
app.use(error);

prisma.$connect()
    .then(() => {
        app.listen(process.env.PORT, () => console.log('server started'))
    })
    .catch((err)=>{
        console.log('Db connection Failed',err)
        process.exit(1)
    })

