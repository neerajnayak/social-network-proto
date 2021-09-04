import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
  const [postText, setPostText] = useState('');

  const onSubmitHandler = (e) => {
    e.preventDefault();
    addPost({text: postText});
    setPostText('');
  };
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form className="form my-1" onSubmit={onSubmitHandler}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
