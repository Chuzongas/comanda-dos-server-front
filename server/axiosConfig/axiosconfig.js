global.devMode = true

global.uri = devMode === true ? "http://d140-20-65-65-181.ngrok.io" : "http://localhost:8810";

global.MyUri = "http://localhost:5000";

global.options = {
	headers: {
		'Content-Type': 'application/json',
	}
}

global.deleteOptions = {
	'Content-Type': 'application/json',
}

global.tokenNameNew = "token-ephyr-comanda-dos"
global.tokenPreAuth = "token-ephyr-comanda-dos-pre-auth"