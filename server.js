const express = require("express");
const data = require("./data");
require("dotenv");
const config = require("./config");
const Mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const mongodbUrl = config.MONGODB_URL;
Mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).catch((error) => console.log(error.reason));

const app = express();
app.use(bodyParser.json());

app.use("/api/users", userRoute);

app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = data.products.find((x) => x._id === productId);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ msg: "product not found" });
  }
});
app.get("/api/products", (req, res) => {
  res.send(data.products);
});
if(process.env.NODE_ENV==='production'){
  app.use(express.static('frontend/build/'));
  app.get('*',(req,res)=>{
      res.sendFile(path.join(__dirname+'frontend/build/index.html'));
  });
}

app.listen(5000, () => {
  console.log("Server started at http://localhost:5000");
});
