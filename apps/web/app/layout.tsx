import './globals.css';

export const metadata = {
  title: 'SmartCare POS',
  description: 'AI-Powered Pharmacy Management Platform',
  icons: {
    icon: '/logo/smartcare%20logo.jpg',
    shortcut: '/logo/smartcare%20logo.jpg',
    apple: '/logo/smartcare%20logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}