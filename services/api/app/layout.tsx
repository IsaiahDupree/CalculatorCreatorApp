export const metadata = {
  title: 'Calculator Creator API',
  description: 'API for Calculator Creator App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}




