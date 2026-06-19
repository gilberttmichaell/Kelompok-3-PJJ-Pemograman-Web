const errorHandler = (err, req, res, next)=> {
    console.error(`[ERROR] ${req.method} ${req.path}`, err.message); //berkaitan dengan routing

    if (err.code === 'ER_DUP_ENTRY'){
        return res.status(400).json({success: false, message: 'Data sudah ada, tidak boleh duplikat'});

    }
    res.status(500).json({success: false, message: err.message});
};

module.exports = errorHandler;