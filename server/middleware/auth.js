const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {

	try {

		const token = req.header(tokenNameNew)
		if (!token) return res.status(401).json({ messange: 'No token arriba' })

		const decode = jwt.verify(token, config.get('jwtsecret'))

		req.userdecode = decode
		next()

	} catch (error) {
		console.error(error.message)
		return res.status(401).json({ message: 'No token' })
	}
}