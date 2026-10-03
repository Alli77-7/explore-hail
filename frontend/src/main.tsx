// نقطة البداية: هنا يتركّب تطبيق React داخل <div id="root"> في index.html
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import Providers from './app/providers';
import { router } from './app/router';

import './styles/variables.css';
import './styles/globals.css';
import './styles/animations.css';
import './styles/responsive.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
