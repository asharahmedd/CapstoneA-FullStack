import './globals.css';
const { AuthProvider } = require('../lib/authContext');

export const metadata = {
  title: 'Superhero Selector',
  description: 'Select your favorite superhero',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}