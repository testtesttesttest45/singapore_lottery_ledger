function ensureAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        next();  // If authenticated, continue to the next middleware or route
    } else {
        res.status(401).send('Login required');
        res.redirect('/login');
    }
}

module.exports = ensureAuthenticated;