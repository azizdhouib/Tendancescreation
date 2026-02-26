const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nom du produit requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description requise']
  },
  price: {
    type: Number,
    required: [true, 'Prix requis'],
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Catégorie requise']
  },
  images: [{
    type: String
  }],
  colors: [{
    name: String,
    hex: String
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
