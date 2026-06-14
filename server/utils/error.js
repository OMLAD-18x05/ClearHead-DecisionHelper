const error = () => {
    console.error(err);
    res.status(500).json({ msg: "Internal server error." })
}

module.exports = {error};