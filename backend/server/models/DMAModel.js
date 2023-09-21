const mongoose = require('mongoose');
const dmaSchema = new mongoose.Schema({
  donorRefID: {
    type: String,
    unique: true,
    require: true
  },
  donorName: {
    type: String,
    require: true
  },
  dateOfBirth: {
    type: String,
    require: true
  },
  age: {
    type: Number,
    require: true
  },
  addressLine1: {
    type: String,
    require: true
  },
  addressLine2: {
    type: String,
    require: true
  },
  city: {
    type: String,
    require: true
  },
  state: {
    type: String,
    require: true
  },
  phoneNumber: {
    type: String,
    require: true
  },
  donationType: {
    type: Array,
    require: true
  },
  availableTimeDurations: {
    type: Array,
  },
  donationAmount: {
    type: Number
  },
  charityType: {
    type: String
  },
  yearOfPassOut: {
    type: Number
  },
  description: {
    type: String
  }
},
{timestamps: true}
)

// module.exports = mongoose.model('DMA', dmaSchema);

//create Model
const donor = mongoose.model('donor', dmaSchema)

module.exports = donor
