import Footer from "@/components/Footer";
import { ProductGrid } from "@/components/Hero";

export const runtime = "edge";

export default async function HomePage() {
  return (
    <>
      <ProductGrid />
      <Footer />
    </>
  );
}
