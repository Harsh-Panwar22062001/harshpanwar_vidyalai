import React, { useState, useEffect, createContext } from 'react';

// Create a context for window width
const WindowWidthContext = createContext();

// Provider component to manage window width state
export function WindowWidthProvider({ children }) {
  // State to track if the device is smaller
  const [isSmallerDevice, setIsSmallerDevice] = useState(false);

  // Effect to update window width on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Update state based on window width
      setIsSmallerDevice(width < 500);
    };

    // Initial resize handling
    handleResize();
    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Provide the window width state to children
  return (
    <WindowWidthContext.Provider value={{ isSmallerDevice }}>
      {children}
    </WindowWidthContext.Provider>
  );
}

// Custom hook to consume window width context
export function useWindowWidth() {
  // Use context to access window width state
  const { isSmallerDevice } = React.useContext(WindowWidthContext);
  // Return window width state
  return { isSmallerDevice };
}
