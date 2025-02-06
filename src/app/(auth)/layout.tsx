import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
