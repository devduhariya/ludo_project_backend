const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
var Router = require('router')
var router = Router()
const app = express();
const dotenv = require("dotenv");

dotenv.config();
// require('./middleware/auth')
require('./models/User');
require('./models/Payment');
require('./models/GameResult');
require('./models/Query');
require('./models/SetChallenge');
require('./models/SellChips');


// app.use(cors({
//     credentials: true,
//   }));
  app.set('trust proxy', 1);
//   app.use(
//     session({
//       secret: session_secret,
//       cookie: { maxAge: 1 * 60 * 60 * 1000, sameSite:'none',secure:true },
//       resave: true,
//       saveUninitialized:false
//     })
//   );



// const User = require('./models/User');
// const authRoutes = require('./routes/api/auth.js');
// const queryRoutes = require('./routes/api/query.js');
// const sellChipsRoute = require('./routes/api/sellchips.js');
// const setChallengeRoute = require('./routes/api/setChallenge.js');
// const buyChipsRoute = require('./routes/api/buyChips.js');

// import authRoutes from './routes/api/auth.js';
// //import userRoutes from './routes/api/users.js'
// import queryRoutes from './routes/api/query.js';
// import sellChipsRoute from './routes/api/sellchips.js'
// import setChallengeRoute from './routes/api/setChallenge.js'
// import buyChipsRoute from './routes/api/buyChips.js'
const Mongo_Url = process.env.Mongo_Url;

const path = require("path");
// const app = express();
// const path = require("path");
// CORS Middleware
app.use(cors());
// Logger Middleware
//app.use(morgan('dev'));
// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
// const db = Mongo_Url;

// Connect to Mongo
// mongoose
//     .connect(db, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true
//     }) // Adding new mongo url parser
//     .then(() => console.log('MongoDB Connected...'))
//     .catch(err => console.log(err));
app.use(express.static(path.join(__dirname, 'build')));
mongoose.Promise = global.Promise;
mongoose.connect(process.env.Mongo_Url ,{ useNewUrlParser: true, useUnifiedTopology: true });

// Use Routes
//app.use('/api/users', userRoutes);

// router.use('/api/auth', authRoutes);
require('./routes/api/auth')(app)
require('./routes/api/buyChips')(app)
require('./routes/api/query')(app)
require('./routes/api/setChallenge')(app)
require('./routes/api/sellchips')(app)
require('./routes/api/users')(app)
// app.use('/api/query', queryRoutes);

// app.use('/api/sellchips', sellChipsRoute);

// app.use('/api/setChallenge', setChallengeRoute);

// app.use('/api/buychips', buyChipsRoute);


app.get('/',(req,res)=>{
res.send("app is runniing at well");
})


// app.use('/api/roomcode', createRoomCode);

// app.use('/api/result', postResult);
// Serve static assets if in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   // Step 1:
//   // app.use(express.static(path.resolve(__dirname, "./client/build")));w
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 9000

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));



// Step 1:
// app.use(express.static(path.resolve(__dirname, "./client/build")));
// // Step 2:
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// });

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
}