import React, { useState, useEffect } from 'react';
// import { Confirmation } from '@ellucian/react-design-system/core';
import Confirmation from '../component/ConfirmationDialog';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  //Illustration,
  //IMAGES,
  TextField,
  Pagination,
  TableFooter,
  TableSortLabel,
  IconButton
} from '@ellucian/react-design-system/core';
import { CircularProgress } from '@ellucian/react-design-system/core';

import { Icon } from '@ellucian/ds-icons/lib';
import PropTypes from 'prop-types';
import { getAllDonors, deleteDonor } from '../service/api';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { widthFluid } from '@ellucian/react-design-system/core/styles/tokens';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@ellucian/react-design-system/core';
import { format } from 'date-fns';
const useStyles = makeStyles({
  tableHeader: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    // backgroundColor: '#5353d1',
    // color: 'white',    
  },
});


const styles = (theme) => ({
  progressroot: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),

    },
    //display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  root: {
    width: widthFluid,
    overflow: 'hidden'
  },
  tableContainer: {
    minWidth: 200,
    overflowX: 'auto',
    height: 300
  },
  table: {
    width: widthFluid
  },
  Illustration: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const AllDonors = () => {
  //const { classes } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderBy, setOrderBy] = useState('BookTitle');
  const [order, setOrder] = useState('asc');
  const classes = useStyles();
  const history = useHistory();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  // const [serverError, setServerError] = useState(false);
  const [paginationOption, setPaginationOptions] = useState({
    rowsPerPage: 5,
    page: 0
  });

  const goToAddDonors = () => {
    history.push('/donor-form');
  };
  useEffect(() => {
    getAllDonor();
  }, []);

  useEffect(() => {
    generateEllString();

  }, [donors]);

  const findLastSequenceNumber = () => {
    if (donors.length === 0) {
      return 0;
    }
    const sequenceArray = donors.map((eachDonor) => {
      const num = eachDonor.donorRefID.slice(4);
      return Number(num);
    });
    return Math.max(...sequenceArray); 
  };
  const handleSort = (colName) => {
    if (orderBy === colName) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(colName);
      setOrder('asc');
    }
  };
  const generateEllString = () => {
    let sequenceNumber = findLastSequenceNumber();

    const incrementedNumber = sequenceNumber + 1;

    let ellString;
    ellString = `ELL-${incrementedNumber}`;
    window.sessionStorage.setItem('donorIdSequenceNumber', ellString);
  };
  console.log(generateEllString);
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
    getAllDonor();
  };

  const filtereddonorDetails = () => {
    const filteredData = donors.filter((item) => {
      return item?.donorName?.toLowerCase()?.includes(searchValue.toLowerCase());
    });
    setDonors(filteredData);
  };

  // const deleteDonorData = async (id) => {
  //   await deleteDonor(id);
  //   getAllDonor();
  // };
  const handleDelete = async () => {
    console.log('Delete property', dialogOpen);
    // const updatedValue = propetyList.filter(
    //   (eachProperty) => eachProperty._id != dialogOpen
    // );
    const response = await deleteDonor(dialogOpen);
    console.log(response);
    setDialogOpen(false);
    if (response) {
      getAllDonor();
    }
    
  };
  const handleChangePage = (_event, pageValue) => {
    const options = { ...paginationOption, page: pageValue };
    setPaginationOptions(options);
  };

  const handleChangeRowsPerPage = (event) => {
    const options = { ...paginationOption, rowsPerPage: event.target.value };
    setPaginationOptions(options);
  };

  const getAllDonor = async () => {
    setLoading(true);
    try {
      let response = await getAllDonors();
      console.log(response);
      setDonors(response.data);
      setLoading(false);
    } catch (error) {
      console.log('error in get all donors', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const data = [...donors];
    if (order === 'asc') {
      data.sort((a, b) => {
        const valueA = typeof a[orderBy] === 'number' ? a[orderBy] : a[orderBy].toString().toLowerCase();
        const valueB = typeof b[orderBy] === 'number' ? b[orderBy] : b[orderBy].toString().toLowerCase();
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      });
    } else {
      data.sort((a, b) => {
        const valueA = typeof a[orderBy] === 'number' ? a[orderBy] : a[orderBy].toString().toLowerCase();
        const valueB = typeof b[orderBy] === 'number' ? b[orderBy] : b[orderBy].toString().toLowerCase();
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      });
    }
    
    // if (order === 'asc') {
    //   data.sort((a, b) => {
       
    //     return a[orderBy] > b[orderBy] ? 1 : b[orderBy] > a[orderBy] ? -1 : 0;
    //   });
    // } else {
    //   data.sort((a, b) => {
       
    //     return b[orderBy] > a[orderBy] ? 1 : a[orderBy] > b[orderBy] ? -1 : 0;
    //   });
    // }
    setDonors(data);
  }, [order, orderBy]);
  const constructTable = () => {

    return (
      <Table stickyHeader className={classes.table} style={{ alignItems: 'center', marginLeft: '15px', marginRight: '30px' ,marginTop:'15px'}}>
        <TableHead>
          <TableRow>
            {/* <TableCell>S NO</TableCell> */}
            <TableCell className={classes.tableHeader}>
            <TableSortLabel
                onClick={() => handleSort('donorRefID')}
                active={orderBy === 'donorRefID'}
                direction={order}
            >
                ID
            </TableSortLabel>
            </TableCell>
            <TableCell className={classes.tableHeader}>
            <TableSortLabel
                onClick={() => handleSort('donorName')}
                active={orderBy === 'donorName'}
                direction={order}
            >
                FullName
            </TableSortLabel>              
            </TableCell>
            <TableCell className={classes.tableHeader}>Year Of PassOut</TableCell>
            <TableCell className={classes.tableHeader}>Date Of Birth</TableCell>
            <TableCell className={classes.tableHeader}>Age</TableCell>
            <TableCell className={classes.tableHeader}>Address</TableCell>
            {/* <TableCell className={classes.tableHeader}>Address Line 1</TableCell> */}
            {/* <TableCell className={classes.tableHeader}>Address Line 2</TableCell> */}
            <TableCell className={classes.tableHeader}>City</TableCell>
            <TableCell className={classes.tableHeader}>State</TableCell>
            <TableCell className={classes.tableHeader}>Phone Number</TableCell>
            <TableCell className={classes.tableHeader}>
            <TableSortLabel
                onClick={() => handleSort('charityType')}
                active={orderBy === 'charityType'}
                direction={order}
            >
              Donation Type
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.tableHeader}>Available Time Durations</TableCell>
            <TableCell className={classes.tableHeader}>Donation Amount $</TableCell>
            <TableCell className={classes.tableHeader}>
            <TableSortLabel
                onClick={() => handleSort('donationType')}
                active={orderBy === 'donationType'}
                direction={order}
            >
              Charity Type
              </TableSortLabel>
            </TableCell>           
            <TableCell className={classes.tableHeader}>Description</TableCell>
            <TableCell className={classes.tableHeader}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {donors
            .slice(
              paginationOption.page * paginationOption.rowsPerPage,
              paginationOption.page * paginationOption.rowsPerPage +
              paginationOption.rowsPerPage
              //1st - 0,2, 2nd-> 2,4 , 3rd-> 4,6 calculation for above code for page:0 and rowsperpage:2
            )
            .map((donor) => {
              console.log('donor', donor);
              return (
                <TableRow key={donor._id}>
                  {/* <TableCell>{index + 1}</TableCell> */}
                  <TableCell>{donor.donorRefID}</TableCell>
                  <TableCell>{donor.donorName}</TableCell>
                  <TableCell>{donor.yearOfPassOut}</TableCell>
                  {/* <TableCell>{(donor.dateOfBirth)}</TableCell> */}
                  <TableCell>{format(new Date(donor.dateOfBirth), 'dd-MM-yyyy')}</TableCell>
                  <TableCell>{donor.age}</TableCell>
                  <TableCell>{donor?.addressLine1}, {donor?.addressLine2}</TableCell>
                  {/* <TableCell>{donor?.addressLine1}</TableCell> */}
                  {/* <TableCell>{donor?.addressLine2 || '--'}</TableCell> */}
                  <TableCell>{donor.city}</TableCell>
                  <TableCell>{donor.state}</TableCell>
                  <TableCell>{donor.phoneNumber}</TableCell>
                  <TableCell>{donor?.donationType?.join(', ')}</TableCell>
                  <TableCell>{donor?.availableTimeDurations?.join(', ')}</TableCell>
                  <TableCell>{donor.donationAmount}</TableCell>
                  <TableCell>{donor.charityType}</TableCell>           
                  <TableCell>{donor.description}</TableCell>
                  <TableCell>
                    {/* <Button
                    color='primary'
                    variant='contained'
                    style={{ marginRight: 5 }}
                    component={Link}
                    to={`/edit/${donor._id}`}
                  >
                    Edit
                  </Button> */}

                    <IconButton onClick={() => history.push(`/edit-form/${donor._id}`)} id={`Edit_Button`} style={{ marginRight: '15px', height: '2rem', width: '2rem', marginBottom: '2px' }}>
                      <Icon name="edit" />
                    </IconButton>
                    {/* <IconButton onClick={() => deleteDonorData(donor._id)} id={`Delete_Button`} style={{ marginRight: '15px', height: '2rem', width: '2rem'}}>
                    <Icon name="trash" />
                </IconButton> */}
                    <IconButton onClick={() => setDialogOpen(donor._id)} id={`Delete_Button`} style={{ marginRight: '15px', height: '2rem', width: '2rem' }}>
                      <Icon name="trash" />
                    </IconButton>

                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <Pagination
              component='td'
              count={Object.keys(donors).length}
              rowsPerPage={paginationOption.rowsPerPage}
              rowsPerPageOptions={[2, 5, 10]}
              page={paginationOption.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
        <Confirmation
          contentText='Are you sure you want to delete this donor?'
          dialogOpen={dialogOpen}
          primaryOnClick={handleDelete}
          primaryText='Delete'
          secondaryOnClick={() => setDialogOpen(false)}
          secondaryText='Cancel'
          title='Delete Donor'
        />
      </Table>


    );
  };

  return (
    <>
      <Typography variant='h2' style={{ marginLeft: '15px' }}>Show Donors List</Typography>
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Grid item xs="auto" style={{ marginLeft: '10px',marginTop:'10px' }} alignItems='center' container spacing={2} marginBottom='3rem'>
          <TextField
            size='small'
            //variant='outlined'
            //style={{ marginTop: 5, paddingLeft: '15px' }}
            // style={{ marginTop: 5 , padding: '10px 20px', paddingLeft: '15px'}}
            label='Search'
            value={searchValue}
            onChange={handleSearch}
          />

          <IconButton
            onClick={filtereddonorDetails}
            id={`Search_Button`}
            style={{ marginLeft: '15px', height: '2.5rem', width: '2.5rem' }}
            disabled={searchValue === ''}

          >
            <Icon name="search" />
          </IconButton>
          <Button
            color='secondary'
            variant='contained'
            style={{ marginLeft: 10, padding: '10px 20px' }}
            disabled={searchValue === ''}
            size="default"
            onClick={clearSearch}
          >
            CLEAR
          </Button>
          <Button onClick={() => goToAddDonors()} style={{ marginLeft: 900, padding: '10px 20px' }}>ADD DONOR</Button>
        </Grid>
      </div>

      {loading ? <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress aria-valuetext="Loading Data..." />
      </div> : constructTable()}

      {/* {!serverError && donors.length > 0 ? (
        constructTable()
      ) : (
        <div className={classes.Illustration}>
          <Illustration
            name={serverError ? IMAGES.ERROR : IMAGES.NO_MESSAGES}
          />
          <Typography variant='h1'>
            {serverError
              ? 'Contact your system administrator'
              : 'No Data Found!'}
          </Typography>
        </div>
      )} */}

    </>
  );
};

AllDonors.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AllDonors);
