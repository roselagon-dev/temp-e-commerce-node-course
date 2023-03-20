const mongoose = require('mongoose')

const SingleOrderItemSchema = mongoose.Schema({
    name:{type:String, required:true},
    image:{type:String, required:true},
    price:{type:Number, required:true},
    amount:{type:Number, required:true},
    product:{
        type: mongoose.Schema.ObjectId,
        ref:'Product',
        required:true
    }
})

const orderSchema = new mongoose.Schema({
    tax: {
        type: Number,
        required: [true, 'Please provide tax'],
    },
    shippingFee: {
        type: Number,
        required: [true, 'Please provide shippingFee'],
    },
    subtotal: {
        type: Number,
        required: [true, 'Please provide subtotal'],
    },
    total: {
        type: Number,
        required: [true, 'Please provide total'],
    },
    orderItems: [SingleOrderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        default:'pending'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    clientSecret: {
        type: String,
        required: [true],
    },
    paymentIntendId: {
        type: String
    },
}, {timestamps:true})

module.exports = mongoose.model('Order', orderSchema)