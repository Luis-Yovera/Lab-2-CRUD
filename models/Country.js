const mongoose = require('mongoose')

const Country = mongoose.model('Country', {
    name: String,
    capital: String,
    n_habitantes: Number,
})  //Estos son atributos

module.exports = Country