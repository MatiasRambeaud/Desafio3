import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Carts";

const schema = new mongoose.Schema({
    products:[
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref:'Products'
        }
    ]
})

schema.plugin(mongoosePaginate)

const cartsModel = mongoose.model(collection,schema);

export default cartsModel;