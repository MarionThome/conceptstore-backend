const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: String,
    password: String,
    token: String,
    profilePic : String,
    pastOrders : [{
        date : Date, 
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
        totalPrice : Number,
    }],
    favs : [{type: mongoose.Schema.Types.ObjectId, ref: 'products'}]
   });

const User = mongoose.model('users', userSchema);
module.exports = User