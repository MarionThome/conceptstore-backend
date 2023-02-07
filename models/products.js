const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    name : String, 
    description : String,
    price: Number, 
    availability : Boolean
});
   

const Product = mongoose.model('products', productSchema);
module.exports = Product