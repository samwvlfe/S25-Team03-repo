import dynamic from "next/dynamic";

const Navigation = dynamic(() => import('./Navigation'), { ssr: false });
import Footer from './components/Footer';

export default function Page() {
  return (
    <>
      <Navigation />
      <main>
        {/* Add your page content here */}
      </main>
      <Footer />
    </>
  );
}
