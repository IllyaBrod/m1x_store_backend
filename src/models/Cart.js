const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                watchId: { type: String, required: true },
                quantity: { type: Number, default: 1 },
            },
        ],
        amount: { type: Number, required: true },
        expireAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 2 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);
