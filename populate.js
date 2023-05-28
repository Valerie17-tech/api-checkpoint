const mongoose = require('mongoose');
require ('dotenv').config()

const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true})
        await Product.deleteMany();
        await Product.create(jsonProducts)
        console.log('success')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start();


