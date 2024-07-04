import { Router } from "express";
import productsManager from "../Managers/mongo/ProductsManager.js";
const router = Router();

router.get("/:page",async(req,res)=>{
    const page = req.params.page.toString()||1;
    const products = await productsManager.paginate({},{page:page,limit:10})
    if(!products){
        res.send({status:error,send:(500),error:error});
    }

    const prevLink = ()=>{
        if(products.hasPrevPage){
            return `http://localhost:8080/api/products/${products.page-1}`;
        }else{
            return null;
        }
    };
    const nextLink = ()=>{
        if(products.hasNextPage){
            return `http://localhost:8080/api/products/${products.page+1}`;
        }else{
            return null;
        }
    };
    res.send({
        status:"success",
        payload:products.docs,
        totalPages:products.totalPages,
        prevPage:products.prevPage,
        nextPage:products.nextPage,
        page:products.page,
        hasPrevPage:products.hasPrevPage,
        hasNextPage:products.hasNextPage,
        prevLink:prevLink(),
        nextLink:nextLink()
    });
})

router.post("/",async(req,res)=>{
    const data = req.body;
    if(!data.title||!data.description||!data.code||!data.price||!data.category){
        res.send({status:error,send:200})
    }
    const newProduct = {
        title:data.title,
        description:data.description,
        code:data.code,
        price:data.price,
        stock:data.stock||1,
        category:data.category,
        status:data.status||true
    }
    const product = await productsManager.create(newProduct);
    console.log("Producto agregado con exito");
    res.send({payload:product});
})

router.put("/:pid",async(req,res)=>{
    
})

router.delete("/:pid",async(req,res)=>{
    
})

export default router;