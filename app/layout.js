import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>
          <h2>This navbar oky</h2>
          <Link href="/pomodoro">Pomodoro</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
