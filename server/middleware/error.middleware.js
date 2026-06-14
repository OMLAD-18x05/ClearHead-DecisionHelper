const error = (err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ msg: err.message || 'Internal server error' });
}

module.exports = { error }