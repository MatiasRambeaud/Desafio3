import fs from "fs"
class CartsManager {

    constructor(){
        this.path = "./src/Carts/Carts.json";
        this.productsPath = "./src/Products/Products.json"
        this.init();
    }

    async init(){
        if(!fs.existsSync(this.path)){
            await fs.promises.writeFile(this.path, JSON.stringify([]));
        }
    }

    addCart(){
        const newCart = {}

        const cartsData = fs.readFileSync(this.path, 'utf-8');
        const carts = JSON.parse(cartsData);
        
        if(carts.length === 0){
            newCart.id = 1;
        }else {
            newCart.id = carts[carts.length - 1].id + 1;
        }
        newCart.products=[];
        carts.push(newCart);

        fs.writeFileSync(this.path, JSON.stringify(carts, null, 4));
    }
    
    addProduct(cart,produc){
        const newProduct = {}

        const cartsData = fs.readFileSync(this.path, 'utf-8');
        const carts = JSON.parse(cartsData);

        const productsData = fs.readFileSync(this.productsPath, 'utf-8');
        const products = JSON.parse(productsData);
        
        newProduct.id=produc;
        newProduct.quantity=1;

        products.forEach(product => {
            if(product.id===produc){
                carts.forEach(Cart => {
                    if(Cart.id===cart){
                        Cart.products.push(newProduct);
                    }
                });
            }
        });

        fs.writeFileSync(this.path, JSON.stringify(carts, null, 4));
    }

    getCart(cid){
        const cartsData = fs.readFileSync(this.path, 'utf-8');
        const carts = JSON.parse(cartsData);

        const cart = carts.map(Cart => {
            if(Cart.id===cid){
                return Cart;
            }
        });
        return cart;
    }
}

export default CartsManager;