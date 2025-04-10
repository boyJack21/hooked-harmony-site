
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkDeviceSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    checkDeviceSize()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkDeviceSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceSize)
  }, [])

  return isMobile
}

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = React.useState<DeviceType>('desktop')

  React.useEffect(() => {
    const checkDeviceType = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setDeviceType('mobile')
      } else if (window.innerWidth < TABLET_BREAKPOINT) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }
    
    // Initial check
    checkDeviceType()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkDeviceType)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType)
  }, [])

  return deviceType
}
