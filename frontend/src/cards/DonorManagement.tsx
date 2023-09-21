import React from 'react';
import {
  makeStyles,
  Button,
  Typography
} from '@ellucian/react-design-system/core';

import { Icon } from '@ellucian/ds-icons/lib';

const useStyles = makeStyles(() => ({
  cardContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
}));

const DonorManagement: React.FC = (props: any): React.ReactElement => {
  const {
    cardControl: { navigateToPage }
  } = props;

  const classes = useStyles();

  const getNavigateUrl = () => {
    navigateToPage({ route: '/' });
  };

  return (
    <div className={classes.cardContainer}>
      <Typography component='div'>
        <h3>Donor Management App</h3>      
      </Typography>
      <Button
        id={'Exp_Card_ContinueButton'}
        size='large'
        endIcon={<Icon name='chevron-right' />}
        onClick={getNavigateUrl}
      >
        Click Here
      </Button>
    </div>
  );
};

export default DonorManagement;
