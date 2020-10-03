require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const movies = require('./movies.json')



const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})


app.get('/movies', function handleGetMovies(req, res) {
    let response = movies.movies;

    // filter movies by film title if name query param is present
    if (req.query.film_title) {
        response = response.filter(movies =>
            // case insensitive searching
            movies.film_title.toLowerCase().includes(req.query.film_title.toLowerCase())
        )
    }
    //filter by genre
    if (req.query.genre) {
        response = response.filter(movies =>
            // case insensitive searching
            movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    //filer by country
    if (req.query.country) {
        response = response.filter(movies =>
            // case insensitive searching
            movies.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    //sort by rating
    if (req.query.avg_vote) {
        response = response.filter(movies =>
            Number(movies.avg_vote) >= Number(req.query.avg_vote)
        )
    }

    res.json(response)
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {

})