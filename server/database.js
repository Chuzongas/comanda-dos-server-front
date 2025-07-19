const mongoose = require('mongoose')

const URI = 'mongodb://rnxpc-20-7-191-53.a.free.pinggy.link:44379/ephyr-database-monitor-comandas'

console.log(`DB URI: ${URI}`)

mongoose.connect(URI, {
	useNewUrlParser: true,
	// useCreateIndex: true,
	// useFindAndModify: false,
	useUnifiedTopology: true
})
	.then(db => console.log('database connected'))
	.catch(err => console.error(err))