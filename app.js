import express from 'express';
import mongoose from 'mongoose';
//import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
//import morgan from 'morgan';
//import config from './config';

// routes
import authRoutes from './routes/api/auth.js';
//import userRoutes from './routes/api/users.js'
import queryRoutes from './routes/api/query.js';
import sellChipsRoute from './routes/api/sellchips.js'
import setChallengeRoute from './routes/api/setChallenge.js'
import buyChipsRoute from './routes/api/buyChips.js'
const Mongo_Url = process.env.Mongo_Url;

// const path = require("path");
const app = express();
// const path = require("path");
// CORS Middleware
app.use(cors());
// Logger Middleware
//app.use(morgan('dev'));
// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
const db = Mongo_Url;

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Use Routes
//app.use('/api/users', userRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/query', queryRoutes);

app.use('/api/sellchips', sellChipsRoute);

app.use('/api/setChallenge', setChallengeRoute);

app.use('/api/buychips', buyChipsRoute);

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




module.exports = app;
