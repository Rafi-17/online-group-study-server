const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9pshpu.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//database and collections
const database= client.db('onlineStudyDB');
const assignmentCollections= database.collection('assignments');

//Get api
//get all assignments
app.get('/assignments', async(req, res)=>{
    try{
        const result= await assignmentCollections.find().toArray();
        res.send(result);
    }
    catch(error){
        console.log(error);
    }
})
//get single assignment
app.get('/assignment/:id', async(req, res) => {
    try{
        const id=req.params.id;
        const query= {_id: new ObjectId(id)}
        const result= await assignmentCollections.findOne(query);
        res.send(result);
    }
    catch(error){
        console.log(error);
    }
})


//Post api
//post assignments
app.post('/assignments', async (req, res) =>{
    try{
        const body=req.body;
        const result= await assignmentCollections.insertOne(body);
        res.send(result);
    }
    catch(error){
        console.log(error);
    }
})

//Put/Patch api
//put assignment
app.put('/assignment/:id', async (req, res) => {
    try{
        const id= req.params.id;
        const assignment= req.body;
        const filter= {_id: new ObjectId(id)};
        const options={upsert: true};
        const updatedAssignment={
            $set:{
                title: assignment.title,
                difficulty: assignment.difficulty,
                marks: assignment.marks,
                photo: assignment.photo,
                description: assignment.description,
                dueDate: assignment.dueDate,
            }
        }
        const result= await assignmentCollections.updateOne(filter, updatedAssignment, options);
        res.send(result);
    }
    catch(error){
        console.log(error);
    }
})

//Delete api
//delete assignment
app.delete(`/assignment/:id`,async(req,res)=>{
    try{
        const id= req.params.id;
        const filter= {_id: new ObjectId(id)};
        const result= await assignmentCollections.deleteOne(filter);
        res.send(result);
    }
    catch(error){
        console.log(error);
    }
})



app.get('/', (req, res) => {
    res.send('Online group study is running')
})

app.listen(port, () => {
    console.log(`Online group study Server is running on port ${port}`)
})