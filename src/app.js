import express from "express";
import mongoose from 'mongoose';

import CartsRouter from "./Routes/carts.router.js"
import ProductsRouter from "./Routes/products.router.js";

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect('mongodb+srv://matiasrambeaud:matirambo@matiasrambeaudcluster1.6s4g2lt.mongodb.net/store?retryWrites=true&w=majority&appName=MatiasRambeaudCluster1')

app.use(express.json());

app.listen(PORT, ()=>console.log("server running."));

app.use("/api/products",ProductsRouter);
app.use("/api/cart",CartsRouter)