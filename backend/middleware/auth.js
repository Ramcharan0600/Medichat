const jwt = require("jsonwebtoken");
module.exports = function auth(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ msg: "No token" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ msg: "Forbidden" });
      next();
    } catch {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
};
