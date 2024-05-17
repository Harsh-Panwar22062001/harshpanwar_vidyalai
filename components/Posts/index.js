import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {

    // State variables for posts, loading indicator, start index, visibility of load more button, and click count
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false); // Initialize to false
  const [clickCount, setClickCount] = useState(0);
  const limit = 9;


  // Custom hook to get window width for responsive design
  const { isSmallerDevice } = useWindowWidth();


  // Fetch initial posts when component mounts
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        const { data: initialPosts } = await axios.get('/api/v1/posts', {
          params: { start, limit: isSmallerDevice ? 5 : 10 },
        });

        setPosts(initialPosts);
        setStart(start + initialPosts.length);
        if (initialPosts.length < limit) {
          setShowLoadMore(false);
        } else {
          setShowLoadMore(true); // Update to true if there are more posts to load
        }
      } catch (error) {
        console.error('Error fetching initial posts:', error);
      }
    };

    fetchInitialPosts();
  }, [isSmallerDevice]);

  const fetchMorePosts = async () => {
    try {
      setIsLoading(true);
      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start, limit },
      });

      // If no new posts are fetched or the number of fetched posts is less than the limit, hide load more button

      if (newPosts.length === 0 || newPosts.length < limit) {
        setShowLoadMore(false);
      } else {
        setShowLoadMore(true); // Update to true if there are more posts to load
        setStart(start + newPosts.length);
        setPosts([...posts, ...newPosts]);
      }

      setClickCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error('Error fetching more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (posts.length > 50) {
      setShowLoadMore(false);
    }
  }, [posts]);





  const fetchUserNameAndEmail = async () => {
    try {
      const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
      const users = usersResponse.data;
  
      const updatedPosts = posts.map(post => {
        const user = users.find(user => user.id === post.userId);
        if (user) {
          return {
            ...post,
            userName: user.username,
            userEmail: user.email,
            userInitials: `${user.name.charAt(0)}${user.name.split(' ')[1] ? user.name.split(' ')[1].charAt(0) : ''}`,
          };
        }
        return post;
      });
  
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  
  

  useEffect(() => {
    fetchUserNameAndEmail();
  }, []);


  return (
    <Container>

    <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {showLoadMore && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={fetchMorePosts} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
