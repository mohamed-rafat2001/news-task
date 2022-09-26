const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('./db/mongoose')
app.use(express.json())
const rptRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
app.use(rptRouter)
app.use(newsRouter)
app.listen(port, () => {
    console.log('server running')
})

