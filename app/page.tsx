import dynamic from "next/dynamic";

const Navigation = dynamic(() => import('./Navigation'), { ssr: false });
import Footer from './components/Footer';

export default function Page() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      <Navigation />
      <Footer />
    </>
  );
}
