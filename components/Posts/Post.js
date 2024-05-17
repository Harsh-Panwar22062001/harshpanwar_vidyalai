import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollSnapType: 'x mandatory',
  scrollBehavior: 'smooth',
  width: '100%',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
  width: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
`;

const ProfileCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const UserEmail = styled.div`
  color: #777;
`;

const Post = ({ post }) => {
  const carouselRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInitials, setUserInitials] = useState('');

  const handleNextClick = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      const scrollAmount = -carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleImageLoad = (index) => {
    if (!loadedImages.includes(index)) {
      setLoadedImages([...loadedImages, index]);
    }
  };

  useEffect(() => {
    const fetchUserNameAndEmail = async () => {
      try {
        const { data: user } = await axios.get(`https://jsonplaceholder.typicode.com/users/${post.userId}`);
        setUserName(user.name);
        setUserEmail(user.email);
        setUserInitials(`${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserNameAndEmail();
  }, [post.userId]);

  return (
    <PostContainer>
      <UserInfo>
        <ProfileCircle>{userInitials}</ProfileCircle>
        <div>
          <UserName>{userName}</UserName>
          <UserEmail>{userEmail}</UserEmail>
        </div>
      </UserInfo>
      <CarouselContainer>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index} style={{ display: loadedImages.includes(index) ? 'block' : 'none' }}>
              <Image src={image.url} alt={post.title} onLoad={() => handleImageLoad(index)} />
            </CarouselItem>
          ))}
        </Carousel>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
    })).isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post;
