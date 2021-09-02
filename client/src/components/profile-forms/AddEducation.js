import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addEducation } from '../../actions/profile';

const initialState = {
  school: '',
  degree: '',
  fieldofstudy: '',
  from: '',
  to: '',
  current: false,
  description: '',
};

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState(initialState);
  const [disableToDate, toggleToDate] = useState(false);

  const { school, degree, fieldofstudy, from, to, current, description } = formData;

  const onChangeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onCurrentToggled = () => {
    setFormData((prevState) => ({ ...prevState, current: !prevState.current }));
    toggleToDate((prevState) => !prevState);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    addEducation(formData, history);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Add Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school or college you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmitHandler}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School/College"
            name="school"
            required
            value={school}
            onChange={onChangeHandler}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree/Certificate"
            name="degree"
            required
            value={degree}
            onChange={onChangeHandler}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Field of study"
            name="fieldofstudy"
            value={fieldofstudy}
            onChange={onChangeHandler}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={onChangeHandler}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={onCurrentToggled}
            />{' '}
            Currently studying
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={onChangeHandler}
            disabled={disableToDate ? 'disabled' : ''}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Description"
            value={description}
            onChange={onChangeHandler}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
