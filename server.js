require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
var Router = require('router')
var router = Router()
const app = express();
// const dotenv = require("dotenv");
const path = require("path");
// dotenv.config();
// require('./middleware/auth')
require('./models/User');
require('./models/Payment');
require('./models/GameResult');
require('./models/Query');
require('./models/SetChallenge');
//require('./models/SellChips');



app.set('trust proxy', 1);

const PORT = process.env.PORT || 6800
app.use(cors());



app.use(express.static(path.join(__dirname, 'build')));
mongoose.Promise = global.Promise;
mongoose.connect(process.env.Mongo_Url || "mongodb+srv://ludo:ludo@ludo.cxaqe.mongodb.net/ludo?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true },()=>{
    console.log('mongodb Connected')
});




app.use(bodyParser.json());
require('./routes/api/auth')(app)
require('./routes/api/buyChips')(app)
require('./routes/api/query')(app)
require('./routes/api/setChallenge')(app)
//require('./routes/api/sellChips')(app)
require('./routes/api/users')(app)
require('./routes/api/postResult')(app)

app.get('/', (req, res) => {
    res.send("app is runniing at well");
});


app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
