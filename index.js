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
    const bidsCollection=db.collection('bids')


    //products APIs
    app.get('/products',async(req,res)=>{
        const projectFields={title:1,price_min:1,price_max:1,image:1}
        // const cursor=productsCollection.find().sort({price_min:-1}).skip(2).limit(2).project(projectFields)

        const email=req.query.email;
        const query={}
        if(email){
            query.email=email
        }
        const cursor=productsCollection.find(query)
        const result=await cursor.toArray()
        res.send(result)
    })

    app.get('/products/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id: id}
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



    //latest products APIs
    app.get('/latest-products',async(req,res)=>{
      const cursor=productsCollection.find().sort({created_at: -1}).limit(6)
      const result=await cursor.toArray()
      res.send(result)
    })



    //bids related APIs
    app.get('/bids',async(req,res)=>{
      const email=req.query.email
      const query={}
      if(email){
        query.buyer_email=email
      }
      const cursor=bidsCollection.find(query)
      const result=await cursor.toArray()
      res.send(result)
    })

    app.post('/bids',async(req,res)=>{
      const newBid=req.body
      const result=await bidsCollection.insertOne(newBid)
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