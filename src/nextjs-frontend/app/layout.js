import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import RootContextProvider from '@/contexts/RootContextProvider';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        
      </head>

      <body>
          <RootContextProvider>
            {children}
          </RootContextProvider>
      </body>
    </html>
  );
}