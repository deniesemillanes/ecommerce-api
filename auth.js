const jwt = require("jsonwebtoken");

const secret = "EcommerceAPI";

module.exports.createAccessToken = (user) => {
	const payload = {
		id: user._id,
		username: user.userName,
		email: user.email,
		isAdmin: user.isAdmin
	}
	return jwt.sign(payload, secret, {expiresIn: "7d"});
}


module.exports.verifyToken = (req,res,next) => {
	let token = req.headers.authorization;

	if (typeof token !== "undefined") {
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (error,data) => {
				if (error) {
					return res.send(`Error in verifying the token. 
						${error}`);
				} else {
					next();
				}
			}
		)
	} else {
		return res.send("Error in verifying the token. Token is undefined")
	}
}


module.exports.decodeToken = (token) => {
	if (typeof token !== "undefined") {
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (error, data) => {
				if (error) {
					return "Error in decoding the token"
				} else {
					return jwt.decode(token, {complete: true}).payload
				}
			}
		)
	} else {
		return "Error in decoding the token. Token is undefined"
	}
}