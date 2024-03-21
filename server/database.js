const mongoose = require('mongoose')

const URI = 'mongodb://localhost:27017/ephyr-database-monitor-comandas'

console.log(`DB URI: ${URI}`)

mongoose.connect(URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log('database connected'))
    .catch(err => console.error(err))