const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
require('dotenv').config()

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.4mzud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
      await client.connect();

      const database = client.db("CoffeeDB");
      const haiku = database.collection("CoffeeDB");

      app.post('/coffee',async(req,res)=>{
            const user = req.body
            const result = await haiku.insertOne(user);
            res.send(result)
      })

      app.get('/coffee',async(req,res)=>{
        const cursor = haiku.find();
        const result = await cursor.toArray();
        res.send(result)
      })

      app.delete('/coffee/:id',async(req,res)=>{
      const a= req.params.id;
      console.log(a)
      const query = { _id: new ObjectId (a) };
      const result = await haiku.deleteOne(query);
      res.send(result)
      })
     
      app.get('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId (id) };
        const result = await haiku.findOne(query)
        res.send(result)
      
      })
      app.put('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const a = req.body
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true }
        const updateDoc = {
          $set: {
            name : a.name,
            url : a.url
          },
        };
        const result = await haiku.updateOne(filter, updateDoc, options);
        res.send(result)
      })





      // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
