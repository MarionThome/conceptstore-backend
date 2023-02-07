const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: String,
    password: String,
    token: String,
    pastOrders : [{
        date : Date, 
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
    }]
   });

const User = mongoose.model('users', userSchema);
module.exports = User