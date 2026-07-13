const {VerifyUser} = require("../Services/authServices")

const isAuthenticated = (req,res,next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided, access denied" });
    }

    const token = authHeader.split(" ")[1];
    const user = VerifyUser(token)

    if(!user) return res.status(401).json({ msg: "Invalid token provided, access denied" });

    req.user = user;

    next();
}

const restrictedto = (roles = []) => {
    return (req,res,next) => {
        if(!req.user) return res
          .status(401)
          .json({ msg: "Invalid token provided, access denied" });

        if (!roles.includes(req.user.role))
          return res
            .status(403)
            .json({ error: "You are not authorized to access this resource" });
        next();
    }
}

module.exports = {isAuthenticated , restrictedto}