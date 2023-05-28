// console.log('04 Store API')
const express = require ('express')
const app = express();
const mongoose = require('mongoose')
require ('express-async-errors')

require ('dotenv').config();

//not found and error middleware importing

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware

app.use(express.json())

const productsRouter = require('./routes/products')


app.get('/', (req,res) => {
    res.send('<h1> Store API</h1><a href = "/api/v1/products">products route</a>')
})

app.use('/api/v1/products',productsRouter)

//Products route
//not found and error middleware
app.use(notFoundMiddleware)
app.use(errorMiddleware)

// port

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true})
        app.listen(PORT, console.log(`server is listening on port ${PORT}`));
    } catch (error) {
        console.log(error)
    }
}

start();
