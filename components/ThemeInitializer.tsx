'use client';

import { useEffect } from 'react';
import { initializeTheme } from '../app/store';

export default function ThemeInitializer() {
  useEffect(() => {
    // Run initialization on the client side after component mounts
    console.log('ThemeInitializer mounted');
    initializeTheme();
  }, []);

  // This component doesn't render anything
  return null;
}
