const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb+srv://oshra:XpiYOxBKyfXms3jt@cluster0.dhbyy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const config = require('../config')

module.exports = {
    getCollection
}

const dbName = 'toy-db'

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        console.log('config.dbURL', config.dbURL);
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}




