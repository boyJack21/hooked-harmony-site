
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force a re-render of the entire application with a timestamp to ensure fresh state
createRoot(document.getElementById("root")!).render(<App key={Date.now()} />);
