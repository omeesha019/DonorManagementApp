import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AddDonors, AllDonors } from './Home';



// for more information on react router: https://v5.reactrouter.com/web/guides/quick-start

const RouterPage = (props) => {
    return (
        <Router basename={props.pageInfo.basePath}>
            <Switch>
                <Route path='/donor-form'>
                    <AddDonors {...props} />
                </Route>
                <Route path='/edit-form/:_id'>
                    <AddDonors {...props} />
                </Route>
                {/* <Route path='/edit/:id'>
                    <EditDonor {...props} />
                </Route> */}
                <Route path='/'>
                    <AllDonors {...props} />
                </Route>
                <Route path='*'>Under Development</Route>
            </Switch>
        </Router>
    );
};

RouterPage.propTypes = {
    pageInfo: PropTypes.object
};

export default RouterPage;
