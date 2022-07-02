const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyvdf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        await client.connect();
        const serviceCollection=client.db('todo_list').collection('items');
        const completedCollection=client.db('todo_list').collection('completedTask');
        app.post('/items',async(req,res)=>{
            const reviews=req.body;
            const result=await serviceCollection.insertOne(reviews);
            res.send(result);
          })
          app.get('/items', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
          });
          app.delete('/items/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const result=await serviceCollection.deleteOne(query);
            res.send(result);
        });
          app.post('/completedTask',async(req,res)=>{
            const reviews=req.body;
            const result=await completedCollection.insertOne(reviews);
            res.send(result);
          })
          app.get('/completedTask', async (req, res) => {
            const query = {};
            const cursor = completedCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
          });   
          app.delete('/completedTask/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const result=await completedCollection.deleteOne(query);
            res.send(result);
        });
            
    }
    finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From todo server')
})

app.listen(port, () => {
  console.log(`todo app listening on port ${port}`)
})