import Navigation from '@/app/(auth)/components/Navigation';

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main id="main">{children}</main>
    </>
  );
}
