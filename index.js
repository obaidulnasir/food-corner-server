const express = require("express");
const app = express();
//Mongo Client
const { MongoClient } = require("mongodb");
//Query by id 
const ObjectId = require('mongodb').ObjectId;
//Query by email
const user = require("mongodb").user;
const email = require("mongodb").email;
//Cors
var cors = require("cors");
//DotEnv
require('dotenv').config();
//port
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


// mongoDB uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmbaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);


const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        console.log("database connect");

        //DATABASE
        const foodCorner = client.db("foodCorner");
        //COLLECTION

        //Product collection
        const product = foodCorner.collection("product");

        //CART collection
        const cart = foodCorner.collection("cart");

        //ADDRESS Collection
        const address = foodCorner.collection("address");


        //ADD Product 
        app.post('/addProduct', async(req, res)=>{
            const newProduct = req.body;
            const result = await product.insertOne(newProduct);
            res.send(result);
            console.log(result);
        });
        //GET All Product
        app.get('/allProduct', async(req, res)=>{
            const result = await product.find({}).toArray();
            res.send(result);
            // console.log(result);
        });

        //GET single Product
        app.get('/product/:id', async(req, res)=>{
            const productId = req.params.id;
            const query = {_id: ObjectId(productId)};
            const result= await product.findOne(query);
            res.send(result);
        });

        //CART
        //Product added in Cart
        app.post('/addToCart', async(req, res)=>{
            const newCart = req.body;
            const result = await cart.insertOne(newCart);
            res.send(result);
            console.log(result);
        });
        //user Cart
        app.get('/cart/:email', async(req, res)=>{
            const userCart = req.params.email;
            console.log(userCart);
            const query = {user: userCart};
            const result = await cart.find(query).toArray();
            res.send(result);
        });

        //POST User Address
        app.post('/userAddress', async(req, res)=>{
            const newAddress = req.body;
            const result = await address.insertOne(newAddress);
            // console.log(result);
            res.send(result);
        });

         app.get('/userAddress/:email', async(req, res)=>{
            const userAddress = req.params.email;
            console.log(userAddress);
            const query = {email: userAddress};
            const result = await address.findOne(query);
            res.send(result);
            console.log(result)
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("server running...!!");
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
