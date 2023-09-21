const express = require('express');
const mongoose = require('mongoose');

//const DMAModel = require('../models/DMAModel');
const donor = require('../models/DMAModel');
const router = express.Router();
// module.exports.getDMA = async (req, res) => {
//   const dma = await DMAModel.find();
//   res.send(dma);
// };

// module.exports.addDMA = async (req, res) => {
//   const {
  router.post('/add', async (req, res) => {
    const {
    donorRefID,
    donorName,
    dateOfBirth,
    age,
    addressLine1,
    addressLine2,
    city,
    state,
    phoneNumber,
    donationType,
    availableTimeDurations,
    donationAmount,
    charityType,
    yearOfPassOut,
    description
  } = req.body;
  try{
    const donorAdded = await donor.create({
    donorRefID: donorRefID,
    donorName: donorName,
    dateOfBirth: dateOfBirth,
    age: age,
    addressLine1: addressLine1,
    addressLine2: addressLine2,
    city: city,
    state: state,
    phoneNumber: phoneNumber,
    donationType: donationType,
    availableTimeDurations: availableTimeDurations,
    donationAmount: donationAmount,
    charityType: charityType ,
    yearOfPassOut: yearOfPassOut,
    description: description
  });

  res.status(201).json(donorAdded);
} catch (error) {
  console.log('error while adding the data', error);
  res.sendStatus(400).json({ error: error.message });
  }
});



//Get All
router.get('/all', async (req, res) => {
  try {
    const showAll = await donor.find();
    res.status(200).json(showAll);
  } catch (error) {
    console.log(error);
    res.sendStatus(404).json({ error: error.message });
  }
});

//get single user
router.get('/donor/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const singleDonorDetails = await donor.findById({ _id: id });
    res.status(200).json(singleDonorDetails);
  } catch (error) {
    console.log(error);
    res.sendStatus(404).json({ error: error.message });
  }
});

//delete
router.delete('/donor/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const singleDonorDetails = await donor.findByIdAndDelete({ _id: id });
    res.status(200).json(singleDonorDetails);
    // console.log("Deleted Successfully", singleDonorDetails);
  } catch (error) {
    console.log(error);
    res.sendStatus(404).json({ error: error.message });
  }
});

//update/edit
router.patch('/edit', async (req, res) => {
  const { _id, ...rest } = req.body;

  const updateDonorDetails = await donor.findByIdAndUpdate(_id, rest)
    .then(() => res.send('Updated succesfully'))
    .catch((err) => console.log(`Error while updating: ${err}`));
});
// // module.exports.updateLMS = async (req, res) => {
// //   const { _id, ...rest } = req.body;

// //   LMSModel.findByIdAndUpdate(_id, rest)
// //     .then(() => res.send('Updated succesfully'))
// //     .catch((err) => console.log(`Error while updating: ${err}`));
// // };
// router.patch('/edit', async (req, res) => {
//   const { ...rest } = req.body;
//   const { id } = req.params;
//   const {
//     _id: id,
//     donorRefID,
//     donorName,
//     dateOfBirth,
//     age,
//     addressLine1,
//     addressLine2,
//     city,
//     state,
//     phoneNumber,
//     donationType,
//     availableTimeDurations,
//     donationAmount,
//     charityType,
//     yearOfPassOut,
//     description
//     // ...rest
//   } = req.body;
//   try {
//     const updateDonorDetails = await donor.findByIdAndUpdate( 
//       id,
//       {
//       ...rest
// }, { new: true }
// );if (!updateDonorDetails) {
//   return res.status(404).send('Donor not found');
// }

// console.log('Updated Successfully', updateDonorDetails);
// res.status(200).json(updateDonorDetails);
// } catch (error) {
// console.error(error);
// res.status(500).json({ error: error.message });
// }
// });
//   ).then(() => res.send('Updated succesfully'))
//     console.log("Updated Successfully", updateDonorDetails);
//     // .catch((err) => console.log(`Error while updating: ${err}`));

//    // res.status(200).json(updateDonorDetails);
    
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500).json({ error: error.message });
//   }
// });
module.exports = router;










// module.exports.updateDMA = async (req, res) => {
//   const {
//     _id,
//     donorRefID,
//     donorName,
//     dateOfBirth,
//     age,
//     addressLine1,
//     addressLine2,
//     city,
//     state,
//     phoneNumber,
//     donationType,
//     availableTimeDurations,
//     donationAmount,
//     charityType,
//     yearOfPassOut,
//     description
//   } = req.body;

//   DMAModel.findByIdAndUpdate(_id, {
//     donorRefID,
//     donorName,
//     dateOfBirth,
//     age,
//     addressLine1,
//     addressLine2,
//     city,
//     state,
//     phoneNumber,
//     donationType,
//     availableTimeDurations,
//     donationAmount,
//     charityType,
//     yearOfPassOut,
//     description
//   })
//     .then(() => res.send('Updated succesfully'))
//     .catch((err) => console.log(`Error while updating: ${err}`));
// };







