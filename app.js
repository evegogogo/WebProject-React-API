const express = require('express');

const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));