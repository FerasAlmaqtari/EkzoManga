module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    },
    ensureRole: function (roles) {
        return (req, res, next) => {
            if (req.isAuthenticated() && roles.includes(req.user.role)) {
                return next();
            } else {
                res.status(403).send('Access Denied: You do not have permission to view this resource.');
            }
        };
    }
};
