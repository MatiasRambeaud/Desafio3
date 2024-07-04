import { Router } from "express";
import productsManager from "../Managers/mongo/ProductsManager.js";
const router = Router();

router.get("/:page", async(req, res) => {
    const page = req.params.page.toString() || 1;
    const products = await productsManager.paginate({}, { page: page, limit: 10 })
    if (!products) {
        res.send({ status: error, send: (500), error: error });
    }

    const prevLink = () => {
        if (products.hasPrevPage) {
            return `http://localhost:8080/api/products/${products.page-1}`;
        } else {
            return null;
        }
    };
    const nextLink = () => {
        if (products.hasNextPage) {
            return `http://localhost:8080/api/products/${products.page+1}`;
        } else {
            return null;
        }
    };
    res.send({
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: prevLink(),
        nextLink: nextLink()
    });
})

router.post("/", async(req, res) => {
    const data = req.body;
    if (!data.title || !data.description || !data.code || !data.price || !data.category) {
        res.send({ status: "error", error: "Missing product values" })
    }
    const newProduct = {
        title: data.title,
        description: data.description,
        code: data.code,
        price: data.price,
        stock: data.stock || 1,
        category: data.category,
        status: data.status || true
    }

    const exists = await productsManager.findOne({ code: data.code });

    if (exists) {
        const updatedProduct = await productsManager.updateOne({ code: data.code }, { stock: exists.stock + newProduct.stock });
        console.log("Product stock incremented successfully");
        res.send({ status: "success", payload: updatedProduct });
    } else {
        const product = await productsManager.create(newProduct);
        if (!product) {
            res.send({ status: "error", error: "Could not create product" });
        } else {
            console.log("Product created successfully");
            res.send({ status: "success", payload: product });
        }
    }
})

router.put("/:pid", async(req, res) => {
    const pid = req.params.pid;
    const data = req.body;

    const update = {
        title: data.title,
        description: data.description,
        code: data.code,
        price: data.price,
        stock: data.stock,
        category: data.category,
        status: data.status
    }
    const updatedProduct = await productsManager.updateOne({ _id: pid }, update);
    if (!updatedProduct) {
        res.send({ status: "error", error: "Could not update product" })
    }
    console.log("Product updated successfully");
    res.send({ status: "success", payload: updatedProduct });
})

router.delete("/:pid", async(req, res) => {
    const pid = req.params.pid;
    const deletedProduct = await productsManager.deleteOne({ _id: pid });
    if (!deletedProduct) {
        res.send({ status: "error", error: "Could not delete product" })
    }
    console.log("Product deleted successfully");
    res.send({ status: "success", payload: deletedProduct });
})

export default router;