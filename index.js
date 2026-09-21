const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT||3000

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://smartDealsUser:duzI3Ni26UIAxM4w@cluster0.durs5dg.mongodb.net/?appName=Cluster0";
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

    const db=client.db('smartDealsDB')
    const productsCollection=db.collection('products')

    app.get('/products',async(req,res)=>{
        const cursor=productsCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })

    app.get('/products/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await productsCollection.findOne(query)
        res.send(result)
    })

    app.post('/products',async(req,res)=>{
       const newProducts=req.body
       const result=await productsCollection.insertOne(newProducts)
       console.log(result)
       res.send(result)
    })

    app.patch('/products/:id',async(req,res)=>{
        const id=req.params.id
        const updatedProduct=req.body
        const query={_id: new ObjectId(id)}
        const update={
            $set:{
                name: updatedProduct.name,
                price:updatedProduct.price
            }
        }
        const result=await productsCollection.updateOne(query,update)
        res.send(result)
    })

    app.delete('/products/:id',async(req,res)=>{
       const id=req.params.id;
       const query={_id:new ObjectId(id)}
       const result=await productsCollection.deleteOne(query)
       res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`port is running on ${port}`)
})