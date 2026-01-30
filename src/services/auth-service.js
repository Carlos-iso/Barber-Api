"use strict";
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
exports.generateToken = async data => {
  const token = jwt.sign(data, jwtSecret, { expiresIn: "15m" });
  const decoded = jwt.verify(token, jwtSecret)
  const expiresAt = decoded.exp * 1000
  return { token, expiresAt };
};
exports.decodeToken = async token => {
  const data = jwt.verify(token, jwtSecret);
  return data;
};
exports.authorize = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    res.status(401).json({
      message: "Restricted Access"
    });
  } else {
    jwt.verify(token, jwtSecret, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: "Token Invalido"
        });
      } else {
        next();
      }
    });
  }
  const data = jwt.verify(token, jwtSecret);
  return data;
};
exports.refreshTokenMiddleware = function (req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ message: "Acesso Restrito: Sem token" });
  }
  jwt.verify(token, jwtSecret, function (error, decoded) {
    if (error && error.name === "TokenExpiredError") {
      try {
        const payload = jwt.decode(token);
        const newToken = jwt.sign({
          id: payload._id || payload.id,
          name_enterprise: payload.name_enterprise,
          email: payload.email,
          createdAt: payload.createdAt,
        },
          jwtSecret,
          { expiresIn: "15m" })
        req.newToken = newToken,
          req.tokenStatus = "expired";
        req.user = payload;
        return next();
      } catch (err) {
        return res.status(401).json({ message: "Erro ao renovar token", details: err.message });
      }
    } else if (error) {
      return res.status(401).json({ message: "Token Inválido", error });
    } else {
      req.tokenStatus = "valid";
      req.user = decoded;
      next();
    }
  });
};