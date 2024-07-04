import { Router } from "express";
import cartsManager from "../Managers/mongo/CartsManager.js";
import productsManager from "../Managers/mongo/ProductsManager.js";

const router = Router();

router.get("/:cid", async(req, res) => {
    const cid = req.params.cid;
    const cart = await cartsManager.findOne({ _id: cid }).populate("products.product");
    if (!cart) {
        res.send({ status: "error", error: "Cart not found" });
    }
    res.send({ status: "success", payload: cart });
})

router.post("/", async(req, res) => {
    const cart = {
        products: []
    };
    const addCart = await cartsManager.create(cart);
    if (!addCart) {
        res.send({ status: "error", error: "Could not create cart" });
    }
    res.send({ status: "success", payload: addCart });
})

router.post("/:cid/products/:pid", async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

    const cart = await cartsManager.findOne({ _id: cid });
    if (!cart) {
        res.send({ status: "error", error: "Cart not found" });
    }
    const product = await productsManager.findOne({ _id: pid });
    if (!product) {
        res.send({ status: "error", error: "Product not found" });
    }

    let exists = false;
    cart.products.forEach(eachproduct => {
        if (eachproduct.product._id == pid) {
            eachproduct.quantity += quantity;
            exists = true;
        }
    });
    if (!exists) {
        cart.products.push({ product: product._id, quantity: quantity });
        const result = await cartsManager.updateOne({ _id: cid }, { products: cart.products });
        if (!result) {
            res.send({ status: "error", error: "Couldnt add product" });
        }
        res.send({ status: "success", payload: result });
    } else {
        const result = await cartsManager.updateOne({ _id: cid }, { $set: { products: cart.products } });
        if (!result) {
            res.send({ status: "error", error: "Couldnt add product" });
        } else {
            res.send({ status: "success", payload: result });
        }
    }

})

router.put("/:cid", async(req, res) => {
    const cid = req.params.cid;
    const data = req.body;

    const result = await cartsManager.updateOne({ _id: cid }, { products: data });
    if (!result) {
        res.send({ status: "error", error: "Could not edit products" });
    }
    res.send({ status: "success", payload: result });
})
router.put("/:cid/products/:pid", async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    const cart = await cartsManager.findOne({ _id: cid });
    if (!cart) {
        res.send({ status: "error", error: "Cart not found" });
    }
    const product = await productsManager.findOne({ _id: pid });
    if (!product) {
        res.send({ status: "error", error: "Product not found" });
    }

    cart.products.forEach(eachproduct => {
        if (eachproduct.product._id == pid) {
            eachproduct.quantity = quantity;
        }
    });

    const result = await cartsManager.updateOne({ _id: cid }, cart);
    if (!result) {
        res.send({ status: "error", error: "Could not edit products" });
    }
    res.send({ status: "success", payload: result });
})

router.delete("/:cid/products/:pid", async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await cartsManager.findOne({ _id: cid });
    if (!cart) {
        res.send({ status: "error", error: "Cart not found" });
    }
    const product = await productsManager.findOne({ _id: pid });
    if (!product) {
        res.send({ status: "error", error: "Product not found" });
    }

    cart.products.forEach(eachproduct => {
        if (eachproduct.product._id == pid) {
            cart.products.splice(eachproduct);
        }
    });

    const result = await cartsManager.updateOne({ _id: cid }, cart);
    if (!result) {
        res.send({ status: "error", error: "Could not delete product" });
    }
    res.send({ status: "success", payload: result });
})

router.delete("/:cid", async(req, res) => {
    const cid = req.params.cid;

    const cart = await cartsManager.findOne({ _id: cid });
    if (!cart) {
        res.send({ status: "error", error: "Cart not found" });
    }

    const result = await cartsManager.updateOne({ _id: cid }, { $set: { products: [] } });
    if (!result) {
        res.send({ status: "error", error: "Could not delete product" });
    }
    res.send({ status: "success", payload: result });
})

export default router;