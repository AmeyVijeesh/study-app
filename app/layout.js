import Link from 'next/link';
import './globals.css';
import AuthButton from './components/AuthButton';
import SessionProvider from './components/SessionProvider';
import NavbarWrapper from './components/NavbarWrapper.jsx'; // New component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProvider>
          <NavbarWrapper />
          <div>
            <h2>This navbar oky</h2>
            <Link href="/pomodoro">Pomodoro</Link>
            <AuthButton />
          </div>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
