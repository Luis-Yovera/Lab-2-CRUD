const express = require('express')
const mongoose = require('mongoose')
const Country = require('./models/Country')

const app = express()

const DB_USER = 'Yosua_13'
const DB_PASSWORD = 'lm0Y9bjbvK2l6Cnl'

app.use(express.json())

app.get('/', (req, res) => { // "/" es conocida como ENDPOINT
    res.json({message: 'Hello express'})
})

////CREATEE

app.post('/country', async (req, res) => {
    const{name, capital, n_habitantes} = req.body
    if(!name){
        res.status(422).json({error: 'Name is mandatory'})
        return
    }
    const country = {
        name, 
        capital,
        n_habitantes,
    }

    try {
        await Country.create(country)
        res.status(201).json({ message: 'Country is defined!' })
        
    } catch (error) {
        res.status(500).json({ error: error})  // la mejor alternativa es crear un log de errores
    }
})

//READ GENERAL

app.get('/country', async (req, res) => {
    try {
        const countries = await Country.find()
        res.status(200).json(countries)
    } catch (error) {
        res.status(500).json({error:error})
    }
})

//REED de una ÚNICA ENTIDAD

// Se realiza el cambio de COUNTRIES por COUNTRY

app.get('/country/:id', async (req, res) => {
    //console.log(req)
    const id =req.params.id //Se trabaja con el parámetro ID  ((Permite extraer el ID del dato))
    try {
        const country = await Country.findOne({_id: id})  // findOne pq solo se trabajará con un dato
        if(!country){   // Try and catch SI COUNTRY NO EXISTE
            res.status(422).json({ message: 'País no encontrado'})
            return
        }
        res.status(200).json(country)
    } catch (error) {
        res.status(500).json({error: error})
    }
})


//UPDATE

app.patch('/country/:id', async (req, res) => {
    const id = req.params.id
    const { name, capital, n_habitantes } = req.body
    const country = {
        name,
        capital,
        n_habitantes,
    }
    try {
        const updateCountry = await Country.updateOne({_id:id},country) 
        //console.log(updateCountry)
        if(updateCountry.matchedCount === 0){  //Validación antes de ACTUALIZAR
            res.status(422).json({ message: 'País no encontrado'})
            return
        }
        res.status(200).json(country) 
    } catch (error) {
        res.status(500).json({error: error}) 
    }
})

// DELETE

app.delete('/country/:id', async (req, res) => {
    const id = req.params.id
    const country = await Country.findOne({_id:id})
    if(!country){  //Validación antes de REMOVER
        res.status(422).json({ message: 'País no encontrado'})
        return
    }
    try {
        await Country.deleteOne({_id:id})
        res.status(200).json({ message: 'País removido'})
    } catch (error) {
        res.status(500).json({ error: error})
    }
})

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.mwjccnt.mongodb.net/Lab2?retryWrites=true&w=majority` //se le agregó Lab2
    ).then(() => {
      console.log('Conectado al MongoDB')
      app.listen(5000)
    })
    .catch((err) => {
        console.log(err)
    })