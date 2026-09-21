const { verifyToken } = require("../services/authentication");

function checkAuth(cookiename){
    return (req, res, next) => {
        const Token = req.cookies[cookiename];
        if(!Token){
           return next();
        }
        try{
            const userPayload = verifyToken(Token);
            req.user = userPayload;
        }catch(error){
        }
        return next();
    };
}

module.exports = {
    checkAuth,
};