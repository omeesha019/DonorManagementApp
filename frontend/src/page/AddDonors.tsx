import React, { useState, useEffect } from 'react';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import {
    ButtonGroup,
    Card,
    CardContent,
    TextField,
    Button,
    DatePicker,
    Dropdown,
    DropdownItem,
    Typography,
    Alert,
    INLINE_VARIANT
} from '@ellucian/react-design-system/core';
import {
    spacing20,
    spacing50,
    spacing60,
    colorBackgroundAlertError,
    colorBackgroundAlertSuccess,
    colorTextAlertDefault,
    colorTextAlertError,
    colorTextAlertSuccess
} from '@ellucian/react-design-system/core/styles/tokens';
import { useParams, useHistory } from 'react-router-dom';
import { getDonor, addDonor, editDonor } from '../service/api';
const styles = () => ({
    inline: {
        marginTop: spacing60,
    },
    inlineAlert: {
        marginBottom: spacing50,
    },
    buttonGroup: {
        marginTop: spacing20
    },
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    card: {
        margin: '1rem',
        width: '50%',
        '& div > div > span': {
            color: '#000000',
            fontSize: '2rem'
        }
    },
    gridContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing20
    },
    warningTypography: {
        color: colorTextAlertDefault
    },
    fieldContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    fieldName: {
        flex: 4
    },
    fieldValue: {
        flex: 8
    },
    failureMessageTypography: {
        whiteSpace: 'pre-line',
        background: colorBackgroundAlertError,
        padding: '10px',
        color: colorTextAlertError
    },
    root: {
        background: colorBackgroundAlertSuccess,
        color: colorTextAlertSuccess
    },
    dropDownItem: {
        borderTop: "0.063rem solid #D9D9D9",
        fontFamily: 'Noto Sans',
        fontSize: '0.90rem',
        fontWeight: 400,
        '& div > span': {
            whiteSpace: "unset",
            wordBreak: "break-all",
            width: '30vw',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        }
    }
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
    console.log('donor', donor)
    const [errorMessage, setErrorMessage] = useState(errorInitialValue);
    console.log('errorMesage', errorMessage)
    const [open, setOpen] = useState(false);
    const alertText = 'Saved Successfully';
    const customId = 'Donor Detail';
   

    useEffect(() => {
        if (_id) {
            getDonorDataById(_id);
        }
    }, [_id]);


    const validateField = () => {
        const curObj = { ...errorInitialValue };

        // Check if any required fields are empty
        if (!donor.donorName) {
            curObj.donorName = 'Name cannot be empty.';
        }

        if (!donor.dateOfBirth) {
            curObj.dateOfBirth = 'Date of Birth cannot be empty.';
        }

        if (!donor.addressLine1) {
            curObj.addressLine1 = 'This field cannot be empty.';
        }
        if (!donor.addressLine2) {
            curObj.addressLine2 = 'This field cannot be empty.';
        }
        if (!donor.city) {
            curObj.city = 'City cannot be empty.';
        }
        if (!donor.state) {
            curObj.state = 'State cannot be empty.';
        }
        if (!donor.phoneNumber) {
            curObj.phoneNumber = 'Phone Number cannot be empty.';
        }
        if (!donor.yearOfPassOut) {
            curObj.yearOfPassOut = 'Year of Passout cannot be empty.';
        }
        if (!donor.description) {
            curObj.description = 'Description cannot be empty.';
        }
        // Check if at least one Donation Type is selected
        if (donor.donationType.length === 0) {
            curObj.donationType = 'Select at least one Donation Type.';
        }

        // Check if Lecture is selected and validate Available Time Duration
        if (donor.donationType.includes('Lecture') && donor.availableTimeDurations.length === 0) {
            curObj.availableTimeDurations = 'Select at least one duration for Lecture.';
        }

        // Check if Money is selected and validate Donation Amount
        if (donor.donationType.includes('Money') && (!donor.donationAmount || donor.donationAmount <= 0)) {
            curObj.donationAmount = 'Enter a valid Donation Amount for Money.';
        }

        // Check if Charity is selected and validate Charity Type
        if (donor.donationType.includes('Charity') && !donor.charityType) {
            curObj.charityType = 'Select Charity Type for Charity.';
        }

        setErrorMessage(curObj);

        // Return true if all fields are valid, otherwise false
        return Object.values(curObj).every((errorMsg) => errorMsg === '');
    };


    const getDonorDataById = async (id) => {
        try {
            console.log('id in130', id)
            const response = await getDonor(id);
            console.log('response', response)
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
        let updatedDonor = { ...donor };
        // setDonor({ ...donor, [name]: value });
        if (name === 'donationType') {
            // Handle changes in the Donation Type field
            updatedDonor.donationType = value;

            // Reset associated fields when Lecture is deselected
            if (!value.includes('Lecture')) {
                updatedDonor.availableTimeDurations = [];
            }

            // Reset associated fields when Money is deselected
            if (!value.includes('Money')) {
                updatedDonor.donationAmount = null;
            }

            // Reset associated fields when Charity is deselected
            if (!value.includes('Charity')) {
                updatedDonor.charityType = '';
            }
        } else {
            // Handle changes in other fields
            updatedDonor = { ...updatedDonor, [name]: value };
        }

        setDonor(updatedDonor);
    }


    const handleSubmit = async (event) => {

        const isValid = validateField();
        event.preventDefault();
        if (isValid) {
            if (_id) {
                const response: any = await editDonor({ ...donor, _id: _id });
                if (response.statusText === 'OK') {
                    setOpen(true);
                    setTimeout(() => {
                        history.push('/');
                    }, 2000);
                }
            } else {
                const response: any = await addDonor(donor);
                console.log(response);
                if (response.statusText === 'Created') {
                    setOpen(true);
                    setTimeout(() => {
                        history.push('/');
                    }, 2000);

                }
            }
        }
    }
    const resetValue = () => {
        const curObj = { ...errorInitialValue };
        setErrorMessage(curObj);
        setDonor(initialValue);

    };

    // const handleClick = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };




    return (
        <div>
            {/* <Card className={classes.inline}> */}
                <Alert
                    alertType="success"
                    autoHideDuration={2000}
                    id={`${customId}_Alert`}
                    open={open}
                    onClose={handleClose}
                    text={alertText}
                    variant={INLINE_VARIANT}
                />
            {/* </Card> */}
        
        <div id={`${customId}_Container`} className={classes.container}>
            
            <Card
                className={classes.card}
                id={`${customId}_Card1`}
                accent={'primary'}
            >
                <Typography variant="h3" gutterBottom style={{ marginBottom: '1rem' }}>
                    Donor Details
                </Typography>
                <form onSubmit={handleSubmit}>
                    <CardContent id={`${customId}_CardContent`}>
                        <div className={classes.gridContainer}>
                            <div className={classes.fieldContainer}>
                                <div className={classes.fieldName}>
                                    <Typography
                                        variant='body1'
                                        gutterBottom={0}
                                        className={classes.fieldTitle}
                                    >
                                        Name<span style={{ color: '#FF0000' }}> *</span>
                                    </Typography>
                                </div>
                                <div className={classes.fieldValue}>
                                    <TextField
                                        size='small'
                                        name="donorName"
                                        onChange={handleChange}
                                        label="Full Name"
                                        value={donor.donorName}
                                        fullWidth={true}
                                        error={errorMessage.donorName !== ''}
                                        helperText={errorMessage.donorName}
                                    />
                                </div>
                            </div>
                            <div className={classes.fieldContainer}>
                                <div className={classes.fieldName}>
                                    <Typography
                                        variant='body1'
                                        gutterBottom={0}
                                        className={classes.fieldTitle}
                                    >
                                        Date Of Birth<span style={{ color: '#FF0000' }}> *</span>
                                    </Typography>
                                </div>
                                <div className={classes.fieldValue}>
                                    <DatePicker
                                        size='small'
                                        label='Date Of Birth'
                                        placeholder='Select a date of birth'
                                        id={'dateOfBirth'}
                                        fullWidth={true}
                                        className='dropdown-field'
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
                                </div>
                            </div>
                            <div className={classes.fieldContainer}>
                                <div className={classes.fieldName}>
                                    <Typography
                                        variant='body1'
                                        gutterBottom={0}
                                        className={classes.fieldTitle}
                                    >
                                        Age
                                    </Typography>
                                </div>
                                <div className={classes.fieldValue}>
                                    <TextField
                                        size='small'
                                        name='age'
                                        className='contact-input-field'
                                        fullWidth={true}
                                        disabled={true}
                                        value={donor.age}
                                        onChange={calculateAge}
                                    />
                                </div>
                            </div>

                            <div className={classes.fieldContainer}>
                                <div className={classes.fieldName}>
                                    <Typography
                                        variant='body1'
                                        gutterBottom={0}
                                        className={classes.fieldTitle}
                                    >
                                        Address<span style={{ color: '#FF0000' }}> *</span>
                                    </Typography>
                                </div>
                                <div className={classes.fieldValue}>
                                    <TextField
                                        size='small'
                                        name="addressLine1"
                                        label="Address Line 1"
                                        placeholder="e.g. House Number"
                                        onChange={handleChange}

                                        value={donor.addressLine1}
                                        className="contact-input-field"
                                        fullWidth={true}
                                        error={errorMessage.addressLine1}
                                        helperText={errorMessage.addressLine1}

                                    />
                                    <div style={{ marginTop: '0.25rem' }}>
                                        <TextField
                                            size='small'
                                            name="addressLine2"
                                            label="Address Line 2"
                                            placeholder="e.g. Lane Number"
                                            value={donor.addressLine2}

                                            onChange={handleChange}
                                            className="contact-input-field"
                                            fullWidth={true}
                                            error={errorMessage.addressLine2}
                                            helperText={errorMessage.addressLine2}
                                            marginBottom='0.25rem'
                                        />
                                    </div>
                                    <div style={{ marginTop: '0.25rem' }}>
                                        <TextField
                                            size='small'
                                            name="city"
                                            label="City"

                                            onChange={handleChange}
                                            className="contact-input-field"
                                            value={donor.city}
                                            fullWidth={true}
                                            error={errorMessage.city}
                                            helperText={errorMessage.city}
                                            marginBottom='0.25rem'
                                        />
                                    </div>
                                    <div style={{ marginTop: '0.25rem' }}>
                                        <TextField
                                            size='small'
                                            name="state"
                                            label="State"
                                            onChange={handleChange}

                                            className="contact-input-field"
                                            value={donor.state}
                                            fullWidth={true}
                                            error={errorMessage.state}
                                            helperText={errorMessage.state}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={classes.fieldContainer}>
                                <div className={classes.fieldName}>
                                    <Typography
                                        variant='body1'
                                        gutterBottom={0}
                                        className={classes.fieldTitle}
                                    >
                                        Phone Number<span style={{ color: '#FF0000' }}> *</span>
                                    </Typography>
                                </div>
                                <div className={classes.fieldValue}>
                                    <TextField
                                        size='small'
                                        name="phoneNumber"
                                        label="Phone Number"
                                        onChange={handleChange}
                                        value={donor.phoneNumber}

                                        className="contact-input-field"
                                        placeholder="000-000-0000"
                                        type="tel"
                                        fullWidth={true}
                                        error={errorMessage.phoneNumber}
                                        helperText={errorMessage.phoneNumber}
                                    />
                                </div>
                            </div>

                            <div className={classes.fieldContainer}>
                                <div className={classes.fieldName}>
                                    <Typography
                                        variant='body1'
                                        gutterBottom={0}
                                        className={classes.fieldTitle}
                                    >
                                        Year of Pass out<span style={{ color: '#FF0000' }}> *</span>
                                    </Typography>
                                </div>
                                <div className={classes.fieldValue}>
                                    <TextField
                                        size='small'
                                        name="yearOfPassOut"
                                        label="Year of Pass out"
                                        onChange={handleChange}
                                        value={donor.yearOfPassOut}

                                        className="contact-input-field"
                                        fullWidth={true}
                                        error={errorMessage.yearOfPassOut}
                                        helperText={errorMessage.yearOfPassOut}
                                    />
                                </div>
                            </div>

                            <div className={classes.fieldContainer} >
                                <div className={classes.fieldName}>
                                    <Typography
                                        variant='body1'
                                        gutterBottom={0}
                                        className={classes.fieldTitle}
                                    >
                                        Description<span style={{ color: '#FF0000' }}> *</span>
                                    </Typography>
                                </div>
                                <div className={classes.fieldValue}>
                                    <TextField
                                        size='small'
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
                                </div>

                            </div>



                            <div className={classes.fieldContainer}>
                                <div className={classes.fieldName}>
                                    <Typography
                                        variant='body1'
                                        gutterBottom={0}
                                        className={classes.fieldTitle}
                                    >
                                        Donation Type<span style={{ color: '#FF0000' }}> *</span>
                                    </Typography>
                                </div>
                                <div className={classes.fieldValue}>
                                    <Dropdown
                                        size='small'
                                        label="Donation Type"
                                        onChange={handleChange}
                                        multiple

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
                                </div>
                            </div>

                            {donor.donationType.includes('Lecture') && (
                                <div className={classes.fieldContainer}>
                                    <div className={classes.fieldName}>
                                        <Typography
                                            variant='body1'
                                            gutterBottom={0}
                                            className={classes.fieldTitle}
                                        >
                                            Available Time Duration<span style={{ color: '#FF0000' }}> *</span>
                                        </Typography>
                                    </div>
                                    <div className={classes.fieldValue}>
                                        <Dropdown
                                            size='small'
                                            label="Available Time Duration"
                                            onChange={handleChange}
                                            multiple
                                            //required
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
                                    </div>
                                </div>
                            )}

                            {donor.donationType.includes('Money') && (
                                <div className={classes.fieldContainer}>
                                    <div className={classes.fieldName}>
                                        <Typography
                                            variant='body1'
                                            gutterBottom={0}
                                            className={classes.fieldTitle}
                                        >
                                            Donation Amount<span style={{ color: '#FF0000' }}> *</span>
                                        </Typography>
                                    </div>
                                    <div className={classes.fieldValue}>
                                        <TextField
                                            size='small'
                                            name="donationAmount"
                                            fullWidth={true}
                                            label="Donation Amount"
                                            //required
                                            className="contact-input-field"
                                            value={donor.donationAmount}
                                            error={errorMessage.donationAmount}
                                            helperText={errorMessage.donationAmount}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                            )}

                            {donor.donationType.includes('Charity') && (
                                <div className={classes.fieldContainer}>
                                    <div className={classes.fieldName}>
                                        <Typography
                                            variant='body1'
                                            gutterBottom={0}
                                            className={classes.fieldTitle}
                                        >
                                            Charity Type<span style={{ color: '#FF0000' }}> *</span>
                                        </Typography>
                                    </div>
                                    <div className={classes.fieldValue}>
                                        <Dropdown
                                            size='small'
                                            label="Charity Type"
                                            onChange={handleChange}
                                            value={donor.charityType}
                                            name='charityType'
                                            error={errorMessage.charityType}
                                            helperText={errorMessage.charityType}
                                            fullWidth={true}
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
                                            {CharityTypeOptions.map((option) => (
                                                <DropdownItem
                                                    key={option}
                                                    label={option}
                                                    value={option}
                                                />
                                            ))}
                                        </Dropdown>
                                    </div>
                                </div>
                            )}

                            <div className={classes.fieldContainer} style={{ marginTop: '0.5rem' }}>
                                <ButtonGroup className={classes.buttonGroup}>
                                    <Button color="primary" style={{ fontWeight: 200, padding: '10px 20px', marginLeft: '0px' }} onClick={handleSubmit} size="default" variant="contained">SAVE</Button>
                                    <Button style={{ fontWeight: 200, padding: '10px 20px', marginLeft: '0px' }} onClick={() => history.push('/')} color="secondary" size="default" variant="contained" >BACK</Button>
                                    <Button style={{ fontWeight: 200, padding: '10px 20px', marginLeft: '0px' }} onClick={resetValue} color="secondary" size="default" variant="contained">RESET</Button>

                                </ButtonGroup>
                            </div>
                        </div>
                    </CardContent>
                </form>

            </Card>
        </div>
        </div>
    );


};
export default withStyles(styles)(AddDonors);
