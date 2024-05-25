import React from 'react';
import PropTypes from 'prop-types';
import { WindowWidthProvider } from '../components/hooks/WindowWidthContext';

// App component serves as the entry point of the application
// It wraps the entire application with the WindowWidthProvider
const App = ({ Component, pageProps }) => (
  <WindowWidthProvider>
    <Component {...pageProps} />
  </WindowWidthProvider>
);

// Define prop types for the App component
App.propTypes = {
  Component: PropTypes.elementType.isRequired, // Component prop should be a valid React component
  pageProps: PropTypes.object.isRequired, // pageProps should be an object
};

export default App;
