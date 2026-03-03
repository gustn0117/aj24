export interface Product {
  id: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  discount?: number;
  image: string;
  badges: string[];
  rating: number;
  category: string;
}

export const megahitProducts: Product[] = [
  {
    id: 1,
    name: "[(주)일코전자] 위드홈 스타일러 PG100",
    originalPrice: 369000,
    salePrice: 369000,
    image: "/images/product1.svg",
    badges: ["히트"],
    rating: 0,
    category: "생활가전",
  },
  {
    id: 2,
    name: "[HarmanKardon] 하만카돈 오라 스튜디오3 블루투스 스피커 AURA STUDIO3",
    originalPrice: 230000,
    salePrice: 230000,
    image: "/images/product2.svg",
    badges: ["히트"],
    rating: 0,
    category: "영상가전",
  },
  {
    id: 3,
    name: "린느플리츠랩원피스_3color",
    originalPrice: 59000,
    salePrice: 59000,
    image: "/images/product3.svg",
    badges: ["히트", "인기"],
    rating: 0,
    category: "잡화",
  },
  {
    id: 4,
    name: "[크롭하츠] 140109000039 CH 스크롤라벨 말발굽 LARGE 실버링 실버",
    originalPrice: 590000,
    salePrice: 480000,
    discount: 19,
    image: "/images/product4.svg",
    badges: ["히트", "1+1"],
    rating: 0,
    category: "잡화",
  },
];

export const recommendProducts: Product[] = [
  {
    id: 5,
    name: "[다이슨] 에어랩 멀티 스타일러 컴플리트 HS05",
    originalPrice: 699000,
    salePrice: 599000,
    discount: 14,
    image: "/images/product5.svg",
    badges: ["추천"],
    rating: 4.5,
    category: "생활가전",
  },
  {
    id: 6,
    name: "[삼성] 비스포크 제트 무선청소기 VS20A956E",
    originalPrice: 890000,
    salePrice: 690000,
    discount: 22,
    image: "/images/product6.svg",
    badges: ["추천"],
    rating: 4.8,
    category: "생활가전",
  },
  {
    id: 7,
    name: "[LG] 스탠바이미 27ART10AKPL 무선 이동식 TV",
    originalPrice: 1090000,
    salePrice: 890000,
    discount: 18,
    image: "/images/product7.svg",
    badges: ["추천", "인기"],
    rating: 4.7,
    category: "영상가전",
  },
  {
    id: 8,
    name: "[발뮤다] 더 토스터 프로 K11A-SE",
    originalPrice: 369000,
    salePrice: 329000,
    discount: 11,
    image: "/images/product8.svg",
    badges: ["추천"],
    rating: 4.3,
    category: "주방가전",
  },
];

export const bestProducts: Product[] = [
  {
    id: 9,
    name: "[캠핑문] 알루미늄 경량 캠핑 체어 접이식",
    originalPrice: 89000,
    salePrice: 59000,
    discount: 34,
    image: "/images/product9.svg",
    badges: ["BEST"],
    rating: 4.6,
    category: "캠핑/레저",
  },
  {
    id: 10,
    name: "[한샘] 포레 원목 4인 식탁세트",
    originalPrice: 450000,
    salePrice: 359000,
    discount: 20,
    image: "/images/product10.svg",
    badges: ["BEST"],
    rating: 4.4,
    category: "생활가구",
  },
  {
    id: 11,
    name: "[필립스] 에스프레소 머신 EP2231",
    originalPrice: 699000,
    salePrice: 549000,
    discount: 21,
    image: "/images/product11.svg",
    badges: ["BEST", "인기"],
    rating: 4.9,
    category: "주방가전",
  },
  {
    id: 12,
    name: "[듀랑고] 프리미엄 가죽 하이킹 부츠",
    originalPrice: 289000,
    salePrice: 229000,
    discount: 21,
    image: "/images/product12.svg",
    badges: ["BEST"],
    rating: 4.5,
    category: "잡화",
  },
];

export const navCategories = [
  "Best items",
  "추천 items",
  "생활가전",
  "영상가전",
  "주방가전",
  "생활가구",
  "캠핑/레저",
  "다이슨 기획전",
  "듀랑고 기획전",
  "잡화",
];
