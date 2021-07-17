const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
var Router = require('router')
var router = Router()
const app = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
// require('./middleware/auth')
require('./models/User');
require('./models/Payment');
require('./models/GameResult');
require('./models/Query');
require('./models/SetChallenge');
require('./models/SellChips');



app.set('trust proxy', 1);

// app.use(cors());
app.use(cors({
    origin: "https://ludowin.herokuapp.com"
  }));



app.use(express.static(path.join(__dirname, 'build')));
mongoose.Promise = global.Promise;
mongoose.connect(process.env.Mongo_Url || "Mongo_Url= mongodb+srv://ludo:ludo@ludo.cxaqe.mongodb.net/ludo?retryWrites=true&w=majority", {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('bufferCommands', false);




app.use(bodyParser.json());
require('./routes/api/auth')(app)
require('./routes/api/buyChips')(app)
require('./routes/api/query')(app)
require('./routes/api/setChallenge')(app)
require('./routes/api/sellchips')(app)
require('./routes/api/users')(app)


app.get('/', (req, res) => {
    res.send("app is runniing at well");
});

const PORT = process.env.PORT || 9000

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
}

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
