import fs from "fs"

class ProductManager {

    constructor(){
        this.path = "./src/Products/Products.json";
        this.init();
    }

    async init(){
        if(!fs.existsSync(this.path)){
            await fs.promises.writeFile(this.path, JSON.stringify([]));
        }
    }

    addProducts({title, description, code, price, stock, category}){
        try{
            const Product = {
                title,
                description,
                code,
                price,
                stock,
                category
            };
            if(!Product.stock){
                Product.stock=1;
            }

            Product.status = true;

            const productsData = fs.readFileSync(this.path, 'utf-8');
            const products = JSON.parse(productsData);
            
            let oldproduct;
            products.forEach(product => {
                if(Product.code===product.code){
                    product.stock += Product.stock;
                    oldproduct=true;
                }
            });
            
            if(products.length === 0){
                Product.id = 1;
            }else {
                Product.id = products[products.length - 1].id + 1;
            }

            if(!oldproduct){
                products.push(Product);
            }

            fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
            console.log("Producto añadido.");

        } catch(error){
            console.log("Error al agregar el producto:", error);
        }
    }

    getProducts(){
        const productsData = fs.readFileSync(this.path, 'utf-8');
        const data = JSON.parse(productsData);
        if(data.length==0){
            return null;
        }else{
            return data;
        }
    }

    getProductsByID(id){
        try{
            const productsData = fs.readFileSync(this.path, 'utf-8');
            const products = JSON.parse(productsData);

            let retProduct;
            products.forEach(product => {
                if(id===product.id){
                    retProduct=product;
                }
            });

            if(retProduct.length==0){
                return null;
            }else{
                return retProduct;
            }
        } catch(error){
            console.log("Error al encontrar el producto:", error);
        }
    }
    

    updateProducts(id,newValues){
    try{
        const productsData =  fs.readFileSync(this.path, 'utf-8');
        const products = JSON.parse(productsData);

    products.forEach(product => {
            if(id===product.id){
                product.title=newValues.title||product.title;
                product.description=newValues.description||product.description;
                product.code=newValues.code||product.code;
                product.price=newValues.price||product.price;
                product.stock=newValues.stock||product.stock||1;
                product.category=newValues.category||product.category;
            }
        });
        fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
    } catch(error){
        console.log("Error al modificar el producto:", error);
    }
    }
    
    deleteProducts(id){
        try{
            const productsData = fs.readFileSync(this.path, 'utf-8');
            const products = JSON.parse(productsData);

            products.forEach(product => {
                if(id===product.id){
                    products.splice(products.indexOf(product),1);
                }
            });
            fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
        } catch(error){
            console.log("Error al eliminar el producto:", error);
        }
    }
}

const productmngr = new ProductManager();
const productnew = {
    title: "Habanos facundo",
    description: "Fresco y clasico sabor de cuba",
    code: "h4b4n0",
    price: 200,
    stock: 1,
    category: "Cigars"
};
//productmngr.addProducts(productnew);
//productmngr.getProducts();
//productmngr.getProductsByID(2);
//productmngr.updateProducts(1,{stock:5,title:"Cafe aquiles",code:"4qu1l35"});
//productmngr.deleteProduct(1);
export default ProductManager;