const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middlewere
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wfzwlor.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() =>{
    const serviceCollection = client.db('foodcloud').collection('services')
    try{
        app.get('/homeservice',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result);
        });
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const cursor = await serviceCollection.findOne(query);
            res.send(cursor);
        });
        // review section started
        app.post('/review',(req,res)=>{
            console.log(req.body)
        })

    }
    finally{

    }
}

run().catch(err=>console.log(err))





app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})