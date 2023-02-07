var express = require('express');
var router = express.Router();

const Product = require('../models/products');


router.get('/all', (req, res) => {
    Product.find({}).then((data) => {
        if(!data){
            res.json({result : false})
        }
        else {
            res.json({result : true, products : data})
        }
    })
})

router.get('/:id', (req, res) => {
    Product.find({"_id" : req.params.id}).then((data) => {
        if(!data){
            res.json({result : false, error : "Product not found"})
        } else {
            res.json({result : true, product : data})
        }
    })
})



module.exports = router;