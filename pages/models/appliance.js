// models/Item.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  owner: {
    type: String,
    required: true,
  },
  appliance: {
    type: String,
    required: true,
  },
  switch: {
    type: Boolean,
    required: true,
  },
});
  
  export default mongoose.models.Item || mongoose.model('Item', ItemSchema);