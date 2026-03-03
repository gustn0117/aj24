import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import {
  megahitProducts,
  recommendProducts,
  bestProducts,
} from "@/data/products";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroBanner />

      <ProductSection
        title="MAGAHIT GOODS"
        subtitle="매가히트 상품들을 만나보세요!"
        products={megahitProducts}
      />

      <ProductSection
        title="RECOMMEND GOODS"
        subtitle="온오프마켓이 추천하는 인기 상품"
        products={recommendProducts}
        bgColor="bg-gray-50"
      />

      <ProductSection
        title="BEST ITEMS"
        subtitle="가장 많이 사랑받는 베스트 아이템"
        products={bestProducts}
      />

      <Footer />
    </main>
  );
}
