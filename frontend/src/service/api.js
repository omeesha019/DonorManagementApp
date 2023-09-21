import axios from 'axios';

const donordatabaseURL = 'http://localhost:5000';

//post
export const addDonor = async (donor) => {
  return await axios.post(`${donordatabaseURL}/add`, donor);
};

//all donors
export const getAllDonors = async () => {
   return await axios.get(`${donordatabaseURL}/all`);
};

//single
export const getDonor = async (id) => {
  id = id || '';

  //const resp = {data: []};
  try {
    return await axios.get(`${donordatabaseURL}/donor/${id}`);
    //return resp;
  } catch (error) {
    console.log('Error while calling getUsers api ', error);
  }
};
//edit
export const editDonor = async ( donor) => {
  return await axios.patch(`${donordatabaseURL}/edit`, donor).then((res)=>{console.log(); return res}).catch((err)=>{console.log(err)});
};
//delete
export const deleteDonor = async (id) => {
  return await axios.delete(`${donordatabaseURL}/donor/${id}`);
};


