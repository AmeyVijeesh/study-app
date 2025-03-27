import Link from 'next/link';
import './globals.css';
import AuthButton from './components/AuthButton';
import SessionProvider from './components/SessionProvider';
import NavbarWrapper from './components/NavbarWrapper'; // New component
import 'mdb-ui-kit/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/8.2.0/mdb.min.css"
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
        <script
          type="text/javascript"
          src="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/8.2.0/mdb.umd.min.js"
        ></script>
      </body>
    </html>
  );
}
