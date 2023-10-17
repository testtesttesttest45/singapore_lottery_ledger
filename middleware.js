// function ensureAuthenticated(req, res, next) {

//     if (req.session.isAuthenticated) {
//         console.log('User is authenticated.');
//         next();  // If authenticated, continue to the next middleware or route
//     } else {
//         console.log('User is not authenticated.');
//         res.redirect('/login');
//     }
// }

const { expressjwt: jwt } = require("express-jwt");
const jwtSECRET = 'password';

const jwtMiddlewareFunction = jwt({
  secret: jwtSECRET,
  algorithms: ['HS256'],
  requestProperty: "user",
  getToken: function fromCookie(req) {
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null; // if no token found, return null
  }
});

const customJwtMiddleware = (req, res, next) => {
  jwtMiddlewareFunction(req, res, (err) => {
    if (err) {
      if (err.name === 'UnauthorizedError') {
        return res.redirect('/login');
      }
      return next(err);
    }
    next();
  });
};

module.exports = { customJwtMiddleware, jwtSECRET }