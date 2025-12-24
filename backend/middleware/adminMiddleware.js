// This middleware assumes the protect middleware has already run and attached req.user
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is admin, proceed
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { admin };