const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
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
    const serviceCollection = client.db('foodcloud').collection('services');
    const reviewsCollection = client.db('foodcloud').collection('reviews')
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
        app.post('/review',async(req,res)=>{
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result); 
        });
        app.get('/reviews',async(req,res)=>{
            const query = {};
            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        // my reviews api
        app.get('/myreviews',async(req,res)=>{
            const email = req.query.email;
            let query = {}
            if(req.query.email){
                query = {email:req.query.email}
            }
            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.post('/jwt',(req,res)=>{
            const user = req.body;
            const token = jwt.sign(user,process.env.TOKEN_SECRET,{expiresIn:'5d'});
            res.send(token);
        })

    }
    finally{

    }
}

run().catch(err=>console.log(err))





app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})