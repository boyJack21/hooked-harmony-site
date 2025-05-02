
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

// Using a single, shared resize handler to improve performance
const useResizeObserver = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  React.useEffect(() => {
    // Debounced resize handler to prevent excessive re-renders
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100); // 100ms debounce
    };
    
    window.addEventListener('resize', handleResize);
    
    // Call handler right away to update initial size
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  
  return windowSize;
}

export function useIsMobile() {
  const { width } = useResizeObserver();
  return width < MOBILE_BREAKPOINT;
}

export function useDeviceType(): DeviceType {
  const { width } = useResizeObserver();
  
  if (width < MOBILE_BREAKPOINT) {
    return 'mobile';
  } else if (width < TABLET_BREAKPOINT) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}
