
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

// Optimize with a shared singleton for window size tracking
const useWindowSize = (() => {
  // Create a shared state that persists between component renders
  let windowSize = {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  };
  
  let listeners: React.Dispatch<React.SetStateAction<{width: number, height: number}>>[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  // Set up the resize handler only once
  if (typeof window !== 'undefined') {
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        windowSize = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        
        // Update all listeners with new size
        listeners.forEach(listener => listener(windowSize));
      }, 150); // Increased debounce time for better performance
    };
    
    window.addEventListener('resize', handleResize);
  }
  
  // Return a hook function that uses the shared state
  return function useWindowSizeHook() {
    const [size, setSize] = React.useState(windowSize);
    
    React.useEffect(() => {
      // Register this component as a listener
      listeners.push(setSize);
      
      // Initial size update
      setSize(windowSize);
      
      // Cleanup listener when component unmounts
      return () => {
        listeners = listeners.filter(listener => listener !== setSize);
      };
    }, []);
    
    return size;
  };
})();

export function useIsMobile() {
  const { width } = useWindowSize();
  // Use React.useMemo to prevent unnecessary re-renders
  return React.useMemo(() => width < MOBILE_BREAKPOINT, [width]);
}

export function useDeviceType(): DeviceType {
  const { width } = useWindowSize();
  
  // Use React.useMemo to prevent unnecessary re-renders
  return React.useMemo(() => {
    if (width < MOBILE_BREAKPOINT) {
      return 'mobile';
    } else if (width < TABLET_BREAKPOINT) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }, [width]);
}
