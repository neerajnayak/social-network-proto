import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState('');

  const onSubmitHandler = (e) => {
    e.preventDefault();
    addComment(postId, {text});
    setText('');
  };
  return (
    <div className="post-form">
      <form className="form my-1" onSubmit={onSubmitHandler}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
