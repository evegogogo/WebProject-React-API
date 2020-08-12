const express = require('express');

const router = express.Router();
const nodemailer = require('nodemailer');


const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const isAuth = require('./middleware/is-auth');

var transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

router.post('/send', (req, res, next) => {
    var name = req.body.name
    var email = req.body.email
    var message = req.body.message
    var content = `name: ${name} \n email: ${email} \n message: ${message} `

    var mail = {
        from: name,
        to: 'shenmenglinyiyi@gmail.com',  // Change to email address that you want to receive messages on
        subject: 'New Message from Contact Form',
        text: content
    }
})

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(isAuth);

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


/* const express = require('express');

const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(isAuth);

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

app.listen(port, () => console.log(`Server started on port ${port}`)); */