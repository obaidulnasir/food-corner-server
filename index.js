const express = require("express");
const app = express();
//Mongo Client
const { MongoClient } = require("mongodb");
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


        //ADD Product 
        app.post('/addProduct', async(req, res)=>{
            const newProduct = req.body;
            const result = await product.insertOne(newProduct);
            res.send(result);
        })
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
