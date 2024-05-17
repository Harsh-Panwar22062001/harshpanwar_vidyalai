const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');


const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await fetchPosts();

  const postsWithImages = await Promise.all(posts.map(async (post) => {
    try {
      // Fetch images for each post
      const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
      const images = response.data.map(photo => ({ url: photo.url }));
      
      return {
        ...post,
        images,
      };
    } catch (error) {
      console.error('Error fetching images:', error);
      // If there's an error fetching images, return the post without images
      return {
        ...post,
        images: [],
      };
    }
  }));

  res.json(postsWithImages);
});

module.exports = router;
