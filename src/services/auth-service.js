'use strict';

const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
	return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}

exports.decodeToken = async (token) => {
	var data = await jwt.verify(token, global.SALT_KEY);
	return data;
}

exports.authorize = function (req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token)
    return res.status(401).json({ message: 'Acesso restrito' });
  jwt.verify(token, global.SALT_KEY, function (error, decoded) {
    if (error)
      return res.status(401).json({ message: 'Token inválido' });
    req.user = decoded;
    next();
  });
};

exports.isAdmin = function (req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) {
		res.status(401).json({
			message: 'Acesso Restrito'
		});
	} else {
		jwt.verify(token, global.SALT_KEY, function (error, decoded) {
			if (error) {
				res.status(401).json({
					message: 'Token Invalido'
				})
			} else {
				if (decoded.role === 'admin') {
					next();
				} else {
					res.status(403).json({
						message: 'Acesso disponível apenas para administradores'
					});
				}
			}
		});
	}
};