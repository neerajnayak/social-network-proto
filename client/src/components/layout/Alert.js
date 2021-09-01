import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
  alerts !== null && alerts.length > 0 && alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          { alert.msg }
      </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired, // receives alerts as props, here destructured
};

const mapStateToProps = (state) => ({
  alerts: state.alert //root reducer's alert --- state.alert
});

export default connect(mapStateToProps)(Alert); // (stateToProps, {actions}) are passed...will be available through props
