import jwt from 'jsonwebtoken';
//import config from '../config';

const  JWT_SECRET  = process.env.JWT_SECRET;
export default (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken =  bearer[1];

    req.token = bearerToken;
    console.log(bearerToken);
    next();
    // console.log("bearerToken",bearer);
  } else {
    res.sendStatus(403);
  }

}




// const { TokenExpiredError } = jwt;

// // const catchError = (err, res) => {
// //   if (err instanceof TokenExpiredError) {
// //     return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
// //   }

// //   return res.sendStatus(401).send({ message: "Unauthorized!" });
// // }
// export default (req, res, next) => {
//   let token = req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send({ message: "No token provided!" });
//   }

//   jwt.verify(token, config.secret, (err, decoded) => {
//     // if (err) {
//     //   return catchError(err, res);
//     // }
//     req.user = decoded.user;
//     console.log("req.userId ",token )
//     next();
//   });
// };