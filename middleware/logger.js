// Middleware: Log mỗi request (method + url + thời gian)
function logger(req, _res, next) {
    const now = new Date().toISOString();
    console.log(`[${req.method}] ${req.url} @ ${now}`);
    next();
}

module.exports = logger;
