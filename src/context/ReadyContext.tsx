import { createContext, useContext } from 'react'

/**
 * ReadyContext — signals that LoadingScreen has finished
 * and the site is ready to reveal content via ScrollTrigger.
 */
export const ReadyContext = createContext(false)
export const useReady = () => useContext(ReadyContext)
