const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ["https://tripmastery-auth.web.app", "http://localhost:5173"]
}))
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v8mpgvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const tourSpotCollection = client.db('tourismDB').collection('tourSpot');
    const countryCollection = client.db('tourismDB').collection('country');
    app.get('/tourspots', async(req,res)=>{
      const result = await tourSpotCollection.find().toArray();
      res.send(result); 
    })

    app.get('/tourspots/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await tourSpotCollection.findOne(query);
      res.send(result); 
    })

    app.get('/tourspots/email/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };  // Search by email
      const result = await tourSpotCollection.find(query).toArray();
      res.send(result); 
    })
    app.get('/tourspots/country_name/:country_name', async (req, res) => {
      const country_name = req.params.country_name;
      const query = { country_name: country_name };  // Search by email
      const result = await tourSpotCollection.find(query).toArray();
      res.send(result); 
    })

    app.post('/tourspots', async(req,res)=>{
      const tourSpot = req.body;
      const result = await tourSpotCollection.insertOne(tourSpot);
      res.send(result); 
    })

    app.delete('/tourspots/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await tourSpotCollection.deleteOne(query);
      res.send(result); 
    })

    app.put('/tourspots/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const newSpot = req.body;
      const options = { upsert: true };
      const updateSpot = {
        $set: {
          spot_name: newSpot.spot_name,
          country_name: newSpot.country_name,
          location: newSpot.location, 
          image: newSpot.image, 
          average_cost: newSpot.average_cost, 
          seasonality: newSpot.seasonality, 
          travel_duration: newSpot.travel_duration, 
          totalVisitorsPerYear: newSpot.totalVisitorsPerYear, 
          description: newSpot.description
        },
      };
      const result = await tourSpotCollection.updateOne(filter, updateSpot, options);
      res.send(result); 
    })



    // Countries data
    app.get('/countries', async(req,res)=>{
      const result = await countryCollection.find().toArray();
      res.send(result); 
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to TripMastery Server')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})