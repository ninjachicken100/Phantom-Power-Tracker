import mongoose from 'mongoose';

const ApplianceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  owner: { type: String, required: true },
  appliance: { type: String, required: true },
  switch: { type: Boolean, required: true },
  lastSwitchedOn: { type: Date, required: true, default: Date.now },
});

const Appliance = mongoose.models.Appliance || mongoose.model('Appliance', ApplianceSchema);

export default Appliance;