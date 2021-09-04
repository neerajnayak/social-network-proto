import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({post: {post, loading}, getPost, match}) => {
    useEffect(() => {
        getPost(match.params.id);
    }, [getPost, match.params.id]);

    if(loading || post === null) {
        return <Spinner />
    }
  return (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showAction={false} />
      <CommentForm postId={post._id} />
      {post.comments.map(comment => <CommentItem postId={post._id} comment={comment} />)}
    </Fragment>
  );
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    post: state.post
})
export default connect(mapStateToProps, {getPost})(Post);
