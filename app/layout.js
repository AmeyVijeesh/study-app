import Link from 'next/link';
import './globals.css';
import AuthButton from './components/AuthButton';
import SessionProvider from './components/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
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
