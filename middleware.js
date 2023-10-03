function ensureAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        next();  // If authenticated, continue to the next middleware or route
    } else {
        res.redirect('/');
    }
}

module.exports = ensureAuthenticated;