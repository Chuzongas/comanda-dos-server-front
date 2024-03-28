const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {

	try {


		const token = req.header(tokenPreAuth)
		if (!token) return res.status(401).json({ messange: 'No token arriba' })

		const decode = jwt.verify(token, config.get('jwtsecret'))

		if (decode.usuario.admin === true) {
			req.userdecode = decode
			next()
			return
		} else if (decode.preData.terminalSeleccionada === true) {
			return res.status(401).json({ message: 'Ya haz seleccionado tu informacion antes' })
		}

		req.userdecode = decode
		next()

	} catch (error) {
		console.error(error.message)
		return res.status(401).json({ message: 'No token' })
	}
}