import Link from 'next/link';
import './globals.css';
import AuthButton from './components/AuthButton';
import SessionProvider from './components/SessionProvider';
import NavbarWrapper from './components/NavbarWrapper.jsx'; // New component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <title>PLStudy - Productivity App</title>
      </head>
      <body>
        <SessionProvider>
          <NavbarWrapper />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
