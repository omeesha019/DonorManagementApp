import React, { useState, useEffect } from 'react';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import {
    //FormControl,
    // FormLabel,
    TextField,
    Button,
    DatePicker,
    Dropdown,
    DropdownItem,
    Typography,
    Paper,
    Grid
    // IconButton
} from '@ellucian/react-design-system/core';

import { useParams, useHistory } from 'react-router-dom';
import {getDonor, addDonor, editDonor} from '../service/api';
const styles = () => ({
    form: {
        '& .contact-input-field': {
            //marginTop: '1rem',
            marginBottom: '0.8rem',
            display: 'block'
        },
        '& .dropdown-field': {
            marginBottom: '0.8rem'
        }
    },
    eachField: {
        width: '350px' 
    },
    contactArea: {
        marginTop: '2rem'
    },
});
const initialValue = {
    donorRefID: '',
    donorName: '',
    dateOfBirth: null,
    age: 0,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    phoneNumber: '',
    donationType: [],
    availableTimeDurations: [],
    donationAmount: null,
    charityType: '',
    yearOfPassOut: '',
    description: ''
};

const errorInitialValue = {
    donorName: '',
        dateOfBirth: '',
        age: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        phoneNumber: '',
        donationType: '',
        availableTimeDurations: '',
        donationAmount: '',
        charityType: '',
        yearOfPassOut: '',
        description: ''
};

const AddDonors = (props) => {
    const { classes } = props;
    const { _id } = useParams();
    const [donor, setDonor] = useState(initialValue);
    const history = useHistory();
    console.log('donor', donor);
    const customId = 'Donor Detail';
    const [errorMessage, setErrorMessage] = useState(errorInitialValue);
    console.log('eroorMesage',errorMessage)
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (_id) {
          getDonorDataById(_id);
        }
      }, [_id]);
    
      const validateField = () => {
        const curObj = { ...errorInitialValue };
        const arr = Object.keys(errorInitialValue).map((each) => {
            if(each === 'donationAmount'){
                if(donor.donationType.find((eachVal) => eachVal === 'Money')){
                    if(donor.donationAmount == '' || donor.donationAmount == null){
                        curObj[each] = 'This field cannot be empty'
                    }
                }
                curObj[each] = ''
                // if(donor.donationType.find((eachVal)=> eachVal ==='Lecture')){
                //     if(donor.availableTimeDurations == [] || donor.availableTimeDurations== null){
                //         curObj[each] = 'This field cannot be empty'
                //     }
                // }
                // curObj[each] = ''
                if(donor.donationType.find((eachVal)=> eachVal ==='Charity')){
                    if(donor.charityType == '' || donor.charityType== null){
                        curObj[each] = 'This field cannot be empty'
                    }
                }
                curObj[each] = ''
            }
          if (donor[each] === '' || donor[each] === null) {
            curObj[each] = 'This field cannot be empty';
            return false;
          }
          return true;
        });
        setErrorMessage(curObj);
        return arr.every((eachValue) => eachValue);
      };


      const getDonorDataById = async (id) => {
        try {
            console.log('id in130',id)
          const response = await getDonor(id);
          console.log('response',response)
          if (response.statusText === 'OK') {
            const { _id: ID, __v, ...rest } = response.data;
            setDonor(rest);
          }
        } catch (error) {
          console.error('Error getting donor data by id', error);
        }
      };
    
    const calculateAge = () => {
        const dateOfBirth = donor.dateOfBirth
        if (dateOfBirth !== null) {
            const birthDate = new Date(dateOfBirth); 
            const dateDiffMs = Date.now() - birthDate.getTime();
            const ageYear = new Date(dateDiffMs);
            const result = Math.abs(ageYear.getUTCFullYear() - 1970);
            
            setDonor({ ...donor, age: result });
        }
    };

    useEffect(() => {
        calculateAge();
        
    }, [donor.dateOfBirth]);

    useEffect(() => {
        const idFromSession = window.sessionStorage.getItem(
            'donorIdSequenceNumber'
        );
        setDonor({ ...donor, donorRefID: idFromSession });
        
    }, []);

    const donationTypes = [
        'Lecture',
        'Money',
        'Charity'
    ];

    const monthsOptions = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const CharityTypeOptions = [
        'In-House',
        'Remote'
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDonor({ ...donor, [name]: value });
    }

    
    const handleSubmit = async (event) => {
        const isValid = validateField();
        event.preventDefault();
       if(isValid){
        if (_id) {
            const response: any = await editDonor({ ...donor, _id: _id });
            if (response.statusText === 'OK') {
              history.push('/');
            }
          } else {
            const response: any = await addDonor(donor);
            console.log(response);
            if (response.statusText === 'Created') {
              history.push('/');
            }
          }
       }
    }
    const resetValue = () => {

        setDonor(initialValue);

     };

    

 

    return (
        <div className={classes.container} id={`${customId}_Container`}>
        <div style={{ height: '650px',marginTop:'2px', display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'}}>
            <Paper elevation={3} style={{ height:'100%',padding: '10px', width: '90%', maxWidth: '700px', display: 'flex', alignItems: 'center', flexDirection: 'column', borderTop: '1rem solid #5353D1'}}>
                <Typography variant="h3" gutterBottom style={{marginBottom:'1rem'}}>
                    Donor Details
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid container style={{height:'560px',overflowY:'scroll',width:'100%'}}>
                        <Grid item xs={12}>
                            <TextField
                                name="donorName"
                                onChange={handleChange}
                                label="Full Name"
                                required
                                value={donor.donorName}
                                fullWidth={true}
                                error={errorMessage.donorName !== ''}
                                helperText={errorMessage.donorName}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                label='Date Of Birth'
                                placeholder='Select a date of birth'
                                id={'dateOfBirth'}
                                fullWidth={true}
                                required
                                className='dropdown-field'
                                // value={donor.dateOfBirth}
                                value={
                                    donor?.dateOfBirth ? new Date(donor.dateOfBirth) : null
                                  }
                                onDateChange={(day) => setDonor({ ...donor, dateOfBirth: day })}
                                error={errorMessage.dateOfBirth}
                                helperText={errorMessage.dateOfBirth}
                                withMonthYearSelect
                                startYear={1980}
                                endYear={2023}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name='age'
                                //label='Age'
                                //style={{ marginTop: 10 }}
                                className='contact-input-field'
                                fullWidth={true}
                                disabled={true}
                                value={donor.age}
                                // error={errorMessage.age !== ''}
                                // helperText={errorMessage.age}
                                onChange={calculateAge}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="addressLine1"
                                label="Address Line 1"
                                placeholder="e.g. House Number"
                                onChange={handleChange}
                                required
                                value={donor.addressLine1}
                                className="contact-input-field"
                                fullWidth={true}
                                error={errorMessage.addressLine1}
                                helperText={errorMessage.addressLine1}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="addressLine2"
                                label="Address Line 2"
                                placeholder="e.g. Lane Number"
                                value={donor.addressLine2}
                                required
                                onChange={handleChange}
                                className="contact-input-field"
                                fullWidth={true}
                                error={errorMessage.addressLine2}
                                helperText={errorMessage.addressLine2}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                            name="city" 
                            label="City" 
                            required 
                            onChange={handleChange} 
                            className="contact-input-field" 
                            value={donor.city} 
                            fullWidth={true} 
                            error={errorMessage.city}
                            helperText={errorMessage.city}
                        />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                            name="state" 
                            label="State" 
                            onChange={handleChange} 
                            required 
                            className="contact-input-field" 
                            value={donor.state} 
                            fullWidth={true} 
                            error={errorMessage.state}
                            helperText={errorMessage.state}
                        />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="phoneNumber"
                                label="Phone Number"
                                onChange={handleChange}
                                value={donor.phoneNumber}
                                required
                                className="contact-input-field"
                                placeholder="000-000-0000"
                                type="tel"
                                fullWidth={true}
                                error={errorMessage.phoneNumber}
                                helperText={errorMessage.phoneNumber}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="yearOfPassOut"
                                label="Year of Pass out"
                                onChange={handleChange}
                                value={donor.yearOfPassOut}
                                required
                                className="contact-input-field"
                                fullWidth={true}
                                error={errorMessage.yearOfPassOut}
                                helperText={errorMessage.yearOfPassOut}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                onChange={handleChange}
                                value={donor.description}
                                multiline
                                //placeholder="Description"
                                className="contact-input-field"
                                fullWidth={true}
                                rows={2}
                                error={errorMessage.description}
                                helperText={errorMessage.description}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Dropdown
                                label="Donation Type"
                                onChange={handleChange}
                                multiple
                                required
                                fullWidth={true}
                                name='donationType'
                                value={donor.donationType}
                                error={errorMessage.donationType}
                                helperText={errorMessage.donationType}
                            >
                                {donationTypes.map(option => (
                                    <DropdownItem
                                        key={option}
                                        label={option}
                                        value={option}
                                    />
                                ))}
                            </Dropdown>
                        </Grid>
                        
                            {donor.donationType.includes('Lecture') && (
                                <Grid item xs={12}>
                                <Dropdown
                                    label="Available Time Duration"
                                    onChange={handleChange}
                                    multiple
                                    required
                                    name='availableTimeDurations'
                                    fullWidth={true}
                                    value={donor.availableTimeDurations}
                                    error={errorMessage.availableTimeDurations}
                                    helperText={errorMessage.availableTimeDurations}
                                >
                                    {monthsOptions.map(option => (
                                        <DropdownItem
                                            key={option}
                                            label={option}
                                            value={option}
                                        />
                                    ))}
                                </Dropdown>
                                </Grid>
                            )}
                        
                        {donor.donationType.includes('Money') && (<Grid item xs={6}>
                              
                                <TextField 
                                    name="donationAmount" 
                                    fullWidth={true} 
                                    label="Donation Amount" 
                                    required 
                                    className="contact-input-field" 
                                    value={donor.donationAmount} 
                                    error={errorMessage.donationAmount}
                                    helperText={errorMessage.donationAmount}
                                    onChange={handleChange} />
                        </Grid>
                            )
                    }
                        {donor.donationType.includes('Charity') && (<Grid item xs={6}>
                             
                                    <Dropdown

                                        label="charityType"
                                        onChange={handleChange}
                                        value={donor.charityType}
                                        name='charityType'
                                        error={errorMessage.charityType}
                                        helperText={errorMessage.charityType}
                                        open={open}
                                        onOpen={(event) => {
                                            console.log('*** onOpen handler called ***', event);
                                            setOpen(true);
                                        }}
                                        onClose={(event) => {
                                            console.log('*** onClose handler called ***', event);
                                            setOpen(false);
                                        }}
                                    >
                                        {/* <DropdownItem
                                            label="None"
                                            value="None"
                                        /> */}
                                        {CharityTypeOptions.map((option) => (
                                            <DropdownItem
                                                key={option}
                                                label={option}
                                                value={option}
                                            />
                                        ))}
                                    </Dropdown>
                                    </Grid>)}
                        </Grid>
                        <Grid item xs={12}>
                        <Button color="primary" style={{ marginRight: '0.5rem' }} onClick={handleSubmit}>SAVE</Button>
                        <Button  style={{ marginRight: '0.5rem' }} onClick={()=>history.push('/')}color="secondary" size="default" variant="contained" >BACK</Button>
                        <Button onClick={resetValue} color="secondary">RESET</Button>
                        </Grid>                       
                    </Grid>
                </form>
            </Paper>
        </div>
        </div>
    );

    
        };
export default withStyles(styles)(AddDonors);
