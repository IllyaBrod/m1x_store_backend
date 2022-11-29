const mongoose = require('mongoose');

const WatchSchema = new mongoose.Schema(
    {
        brand: { type: String, required: true },
        model: { type: String, required: true },
        gender: { type: String },
        movement: { type: String },
        watchLabel: { type: String },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: Buffer },
        dialInformation: {
            dialColor: { type: String },
            crystal: { type: String },
            dialType: { type: String },
        },
        caseInformation: {
            caseDiameter: { type: String },
            caseThickness: { type: String },
            caseMaterial: { type: String },
        },
        bandInformation: {
            bandMaterial: { type: String },
            bandType: { type: String },
            bandLength: { type: String },
            bandWidth: { type: String },
        },
        featuresInformation: {
            waterResistance: { type: String },
            features: [{ type: String }],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Watch', WatchSchema);
