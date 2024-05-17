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
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts from the API
        const { data: posts } = await axios.get('/api/v1/posts', {
          params: { start: 0, limit: isSmallerDevice ? 5 : 10 },
        });

        
        const postsWithImages = await Promise.all(posts.map(async (post) => {
          // Fetch photos for the album associated with the post
          const { data: photos } = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
          
          const images = photos.map(photo => ({ url: photo.url }));
          // Combine post data with images
          return { ...post, images };
        }));

        // Update state with posts containing images
        setPosts(postsWithImages);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [isSmallerDevice]);

  const handleClick = () => {
    setIsLoading(true);

    // add a loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} /> 
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LoadMoreButton onClick={handleClick} disabled={isLoading}>
          {!isLoading ? 'Load More' : 'Loading...'}
        </LoadMoreButton>
      </div>
    </Container>
  );
}

/*
 

2nd Task Done ✅✅

Replace dummy images by fetching each album of post using "https://jsonplaceholder.typicode.com/albums/1/photos" in /api/v1/posts route.
*/
