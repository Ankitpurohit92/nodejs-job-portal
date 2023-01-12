const express= require('express')
require('./db/mongoose')
const adminRouter= require('./routers/admin')
const jwt= require('jsonwebtoken')

const app=express()

app.use(express.json())
app.use(adminRouter)

module.exports=app;

