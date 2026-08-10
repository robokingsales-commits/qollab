/**
 * Location-based Radius Filter & Multi-step DIY Combo Service
 */

export interface LocationPreset {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  iconType: "gps" | "home" | "office" | "custom";
}

export interface ComboItemStore {
  id: string;
  storeName: string;
  category: string;
  itemName: string;
  originalPrice: number;
  comboPrice: number;
  vimScore: number;
  lat: number;
  lng: number;
  address: string;
  distanceKm: number;
  tags: string[];
  imageUrl: string;
  storyLabel: string;
}

export interface DIYComboStep {
  stepIndex: number;
  keyword: string;
  selectedStoreItem?: ComboItemStore;
}

// Preset User Locations (GPS, Home, Office, Custom) - MVP 기본 위치: 경기도 부천시
export const DEFAULT_USER_LOCATIONS: LocationPreset[] = [
  {
    id: "loc-gps",
    label: "📍 현재 내 위치 (GPS - 부천)",
    address: "경기도 부천시 원미구 중동 (신중동역 부근)",
    lat: 37.5042,
    lng: 126.7645,
    iconType: "gps",
  },
  {
    id: "loc-home",
    label: "🏠 집 (부천 중동 위브)",
    address: "경기도 부천시 원미구 중동 1106 (위브더스테이트)",
    lat: 37.5030,
    lng: 126.7660,
    iconType: "home",
  },
  {
    id: "loc-office",
    label: "🏢 사무실 (부천시청역)",
    address: "경기도 부천시 원미구 중동 1156 (부천시청 부근)",
    lat: 37.5050,
    lng: 126.7630,
    iconType: "office",
  },
];

// Haversine formula for calculating distance between two coordinates in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

import { PERSONA_PACKAGES_100 } from "@/lib/data/personaPackages";

// Sample Stores Database with coordinates for Seongsu, Yeoksam, Yeonnam, Bucheon
const SAMPLE_STORES_DB: Omit<ComboItemStore, "distanceKm">[] = [
  // 성수동 매장들 (37.5475, 127.0435 부근)
  {
    id: "store-seongsu-movie-1",
    storeName: "CGV 성수점",
    category: "영화관/문화",
    itemName: "CGV 2D 영화 관람권 2매 + 시그니처 팝콘 콤보",
    originalPrice: 32000,
    comboPrice: 21000,
    vimScore: 98,
    lat: 37.5448,
    lng: 127.0442, // 약 0.3km 거리 (성수역 부근 1km 이내!)
    address: "서울 성동구 아차산로 5 (성수동1가)",
    tags: ["영화", "cgv", "팝콘", "영화관", "문화", "성수", "극장", "관람권"],
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    storyLabel: "성수역 도보 3분! 최신 4D/IMAX 프리미엄 관람관",
  },
  {
    id: "store-seongsu-movie-2",
    storeName: "메가박스 성수점",
    category: "영화관/문화",
    itemName: "메가박스 영화 관람권 2매 + 러브 콤보 (팝콘+음료2)",
    originalPrice: 30000,
    comboPrice: 19500,
    vimScore: 96,
    lat: 37.5458,
    lng: 127.0420, // 약 0.2km 거리 (성수역 부근)
    address: "서울 성동구 왕십리로 50 (성수동1가)",
    tags: ["영화", "메가박스", "팝콘", "영화관", "문화", "성수", "극장"],
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    storyLabel: "성수 메가박스 본사 직영관 프리미엄 시네마",
  },
  {
    id: "store-seongsu-1",
    storeName: "성수 대반점",
    category: "중식/맛집",
    itemName: "삼선 짜장면 + 찹쌀 탕수육 세트",
    originalPrice: 16000,
    comboPrice: 12000,
    vimScore: 96,
    lat: 37.5482,
    lng: 127.0441,
    address: "서울 성동구 성수동1가 14-2",
    tags: ["짜장면", "중식", "탕수육", "점심", "성수"],
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
    storyLabel: "30년 수타면 명인의 깊은 풍미",
  },
  {
    id: "store-seongsu-2",
    storeName: "성수 루프탑 로스터리",
    category: "카페/디저트",
    itemName: "시그니처 아인슈페너 2잔 + 바스크 치즈케이크",
    originalPrice: 18000,
    comboPrice: 13500,
    vimScore: 94,
    lat: 37.5468,
    lng: 127.0428,
    address: "서울 성동구 성수동1가 22-1",
    tags: ["커피", "카페", "디저트", "루프탑", "성수"],
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    storyLabel: "성수 루프탑에서 즐기는 파노라마 뷰",
  },
  {
    id: "store-seongsu-3",
    storeName: "성수 아틀리에 두피 스파",
    category: "뷰티/힐링",
    itemName: "1:1 디톡스 유기농 두피 스파 (45분)",
    originalPrice: 55000,
    comboPrice: 38000,
    vimScore: 98,
    lat: 37.5491,
    lng: 127.0452,
    address: "서울 성동구 성수동2가 5-8",
    tags: ["스파", "두피스파", "뷰티", "힐링", "성수"],
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    storyLabel: "도시인의 스트레스를 녹이는 맞춤 헤드스파",
  },
  {
    id: "store-seongsu-4",
    storeName: "뚝섬 크래프트 비어 파일럿",
    category: "수제맥주/주점",
    itemName: "성수 IPAS 4종 샘플러 + 스페인 타파스",
    originalPrice: 32000,
    comboPrice: 22000,
    vimScore: 92,
    lat: 37.5451,
    lng: 127.0415,
    address: "서울 성동구 성수동1가 685",
    tags: ["맥주", "수제맥주", "술집", "타파스", "성수"],
    imageUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80",
    storyLabel: "독자 양조 효모의 참맛과 수제맥주 컬렉션",
  },
  {
    id: "store-seongsu-5",
    storeName: "성수 클래식 아날로그 재즈바",
    category: "문화/공연",
    itemName: "주말 바이닐 재즈 라이브 입장의 2인 바우처",
    originalPrice: 25000,
    comboPrice: 17000,
    vimScore: 95,
    lat: 37.5498,
    lng: 127.0471,
    address: "서울 성동구 성수동2가 31-4",
    tags: ["재즈바", "음악", "공연", "데이트", "성수"],
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    storyLabel: "빈티지 하이엔드 오디오로 듣는 오리지널 음향",
  },

  // 성수동 3km 반경 매장
  {
    id: "store-seongsu-far-1",
    storeName: "건대 스타시티 CGV",
    category: "영화/문화",
    itemName: "CGV 영화 관람권 2매 + 시그니처 팝콘 콤보",
    originalPrice: 32000,
    comboPrice: 21000,
    vimScore: 97,
    lat: 37.5385,
    lng: 127.0718, // 약 2.8km 떨어진 건대입구
    address: "서울 광진구 자양동 227-7",
    tags: ["영화", "cgv", "팝콘", "문화", "영화관"],
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    storyLabel: "프리미엄 4D 관람 환경과 영화 패키지",
  },
  {
    id: "store-seongsu-far-2",
    storeName: "뚝섬유원지 댕댕이 펫파크",
    category: "펫/가족",
    itemName: "강아지 프리미엄 수제 간식 3종 + 펫카페 2인",
    originalPrice: 28000,
    comboPrice: 19000,
    vimScore: 93,
    lat: 37.5312,
    lng: 127.0665, // 약 2.4km
    address: "서울 광진구 자양동 704",
    tags: ["강아지", "수제간식", "펫", "애완"],
    imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80",
    storyLabel: "유기농 무첨가 강아지 수제간식 전문점",
  },

  // 역삼동 매장들 (37.5002, 127.0365 부근)
  {
    id: "store-yeoksam-movie-1",
    storeName: "CGV 강남점",
    category: "영화관/문화",
    itemName: "CGV 영화 관람권 2매 + 스윗팝콘 콤보",
    originalPrice: 31000,
    comboPrice: 20000,
    vimScore: 97,
    lat: 37.5015,
    lng: 127.0262,
    address: "서울 강남구 역삼동 814-6",
    tags: ["영화", "cgv", "팝콘", "강남", "역삼", "영화관"],
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    storyLabel: "강남역 메가 타워 랜드마크 대표 영화관",
  },
  {
    id: "store-yeoksam-1",
    storeName: "역삼 만다린 중화요리",
    category: "중식/맛집",
    itemName: "해물 간짜장 + 수제 군만두 세트",
    originalPrice: 15000,
    comboPrice: 11500,
    vimScore: 95,
    lat: 37.5011,
    lng: 127.0372,
    address: "서울 강남구 역삼동 740",
    tags: ["짜장면", "중식", "역삼", "점심"],
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
    storyLabel: "역삼 직장인 추천 1위 간짜장 명가",
  },
  {
    id: "store-yeoksam-2",
    storeName: "강남 센트럴 블루보틀 카페",
    category: "카페/디저트",
    itemName: "콜드브루 2잔 + 크루아상 베이커리",
    originalPrice: 17000,
    comboPrice: 13000,
    vimScore: 96,
    lat: 37.4995,
    lng: 127.0351,
    address: "서울 강남구 역삼동 825",
    tags: ["커피", "카페", "강남", "베이커리"],
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    storyLabel: "신선한 원두로 드리핑하는 강남 프리미엄 커피",
  },

  // 연남동 매장들 (37.5623, 126.9248 부근)
  {
    id: "store-yeonnam-movie-1",
    storeName: "CGV 홍대점",
    category: "영화관/문화",
    itemName: "CGV 2D 영화 2매 + 음료 팝콘 패키지",
    originalPrice: 32000,
    comboPrice: 21000,
    vimScore: 98,
    lat: 37.5565,
    lng: 126.9228,
    address: "서울 마포구 동교동 160-4",
    tags: ["영화", "cgv", "홍대", "연남", "영화관"],
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    storyLabel: "홍대 연남 감성 문화 영화 관람관",
  },
  {
    id: "store-yeonnam-1",
    storeName: "연남 중화 복만루",
    category: "중식/맛집",
    itemName: "옛날 짜장면 + 꿔바로우 소자",
    originalPrice: 22000,
    comboPrice: 16500,
    vimScore: 94,
    lat: 37.5631,
    lng: 126.9255,
    address: "서울 마포구 연남동 229-2",
    tags: ["짜장면", "중식", "연남동", "꿔바로우"],
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
    storyLabel: "바삭하고 달콤한 꿔바로우와 차이나 세트",
  },
  {
    id: "store-yeonnam-2",
    storeName: "연남 아뜰리에 테라스 카페",
    category: "카페/디저트",
    itemName: "아인슈페너 + 수제 딸기 와플",
    originalPrice: 16000,
    comboPrice: 12000,
    vimScore: 97,
    lat: 37.5615,
    lng: 126.9239,
    address: "서울 마포구 연남동 383-1",
    tags: ["커피", "카페", "와플", "연남동"],
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    storyLabel: "연남동 숲길이 한눈에 보이는 감성 카페",
  },
];

// Dynamically convert PERSONA_PACKAGES_100 into ComboItemStore entries (MVP 기본 위치: 부천 중심 반경 바인딩)
const PERSONA_STORES_DB: Omit<ComboItemStore, "distanceKm">[] = PERSONA_PACKAGES_100.map((p) => {
  // 부천 신중동역/부천시청역 중심 (37.5042, 126.7645) 근방 0.1km~1.2km 분산
  const lat = 37.5042 + ((p.no * 3) % 15) * 0.0008 - 0.005;
  const lng = 126.7645 + ((p.no * 5) % 15) * 0.0008 - 0.005;
  return {
    id: `persona-store-${p.id}`,
    storeName: p.store,
    category: p.category,
    itemName: p.product,
    originalPrice: p.origPrice,
    comboPrice: p.price,
    vimScore: p.vimScore,
    lat,
    lng,
    address: `${p.region} 인근 매장`,
    tags: [p.store, p.category, p.product, ...p.keywords],
    imageUrl: p.category.includes("영화") || p.store.includes("CGV")
      ? "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
      : p.category.includes("카페") || p.category.includes("디저트")
      ? "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
      : "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
    storyLabel: p.subtitle,
  };
});

const ALL_STORES_DB = [...SAMPLE_STORES_DB, ...PERSONA_STORES_DB];

/**
 * 반경 내 매장 검색 함수 (위치 + 반경 + 키워드)
 */
export function searchStoresByRadius(
  userLat: number,
  userLng: number,
  radiusKm: number,
  keyword: string
): ComboItemStore[] {
  const cleanKeyword = keyword.trim().toLowerCase();

  const storesWithDistance = ALL_STORES_DB.map((store) => {
    const dist = calculateHaversineDistance(userLat, userLng, store.lat, store.lng);
    return {
      ...store,
      distanceKm: dist,
    };
  });

  // 1. 키워드 검색 필터링
  const keywordMatches = storesWithDistance.filter((store) => {
    if (!cleanKeyword) return true;

    const titleMatch = store.storeName.toLowerCase().includes(cleanKeyword);
    const itemMatch = store.itemName.toLowerCase().includes(cleanKeyword);
    const categoryMatch = store.category.toLowerCase().includes(cleanKeyword);
    const tagMatch = store.tags.some((tag) => tag.toLowerCase().includes(cleanKeyword));

    return titleMatch || itemMatch || categoryMatch || tagMatch;
  });

  // 2. 반경 내 필터링
  const withinRadiusMatches = keywordMatches.filter((store) => store.distanceKm <= radiusKm);

  // 반경 내 매장이 있으면 반경 내 매장만 거리순 정렬하여 반환
  if (withinRadiusMatches.length > 0) {
    return withinRadiusMatches.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // 예외 처리: 사용자가 특정 키워드를 검색했으나 선택 반경 내 매장이 없으면, 반경에 구애받지 않고 가장 가까운 검색 매장을 거리순 정렬하여 노출
  if (cleanKeyword && keywordMatches.length > 0) {
    return keywordMatches.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // 키워드가 없을 시 거리순 상위 10개 매장 반환
  return storesWithDistance.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 10);
}

/**
 * 사업자 허용 '최대 할인 여유 금액(할인 여력)' 기반 다단계 연쇄 할인 계산 서비스
 * 
 * Rules:
 * - 1개 결합 (단독): 할인 여력의 0% 적용 (정가 판매)
 * - 2개 결합: 할인 여력의 60% 적용
 * - 3개 결합: 할인 여력의 85% 적용
 * - 4개 이상 결합: 할인 여력의 100% 전부 적용 (사업자 허용 최대할인가)
 */

export interface ItemMarginPricing {
  storeId: string;
  storeName: string;
  category: string;
  itemName: string;
  imageUrl?: string;
  address?: string;
  originalPrice: number;
  minPrice: number;
  discountCapacity: number;
  appliedDiscount: number;
  finalPrice: number;
}

export interface ComboMarginPricingResult {
  itemCount: number;
  rateRatio: number;
  ratePercent: number;
  badgeLabel: string;
  description: string;
  items: ItemMarginPricing[];
  totalOriginalPrice: number;
  totalDiscountCapacity: number;
  totalDiscountAmount: number;
  totalFinalPrice: number;
}

export function getMarginDiscountRate(itemCount: number): {
  rateRatio: number;
  ratePercent: number;
  badgeLabel: string;
  description: string;
} {
  if (itemCount <= 1) {
    return {
      rateRatio: 0.0,
      ratePercent: 0,
      badgeLabel: "1개 단독 (정가)",
      description: "단품 구매 - 할인 여력 0% 반영",
    };
  } else if (itemCount === 2) {
    return {
      rateRatio: 0.6,
      ratePercent: 60,
      badgeLabel: "🔥 2개 결합 (여력 60% 할인)",
      description: "사업자 허용 할인 여력의 60% 반영",
    };
  } else if (itemCount === 3) {
    return {
      rateRatio: 0.85,
      ratePercent: 85,
      badgeLabel: "🚀 3개 결합 (여력 85% 할인)",
      description: "사업자 허용 할인 여력의 85% 반영",
    };
  } else {
    return {
      rateRatio: 1.0,
      ratePercent: 100,
      badgeLabel: "👑 4개 이상 (여력 100% 최대할인)",
      description: "사업자 허용 할인 여력의 100% 전격 반영 (최대할인가)",
    };
  }
}

export function calculateComboMarginPricing(
  stores: ComboItemStore[]
): ComboMarginPricingResult {
  const itemCount = stores.length;
  const rateInfo = getMarginDiscountRate(itemCount);

  let totalOriginalPrice = 0;
  let totalDiscountCapacity = 0;
  let totalDiscountAmount = 0;
  let totalFinalPrice = 0;

  const items: ItemMarginPricing[] = stores.map((store) => {
    const originalPrice = store.originalPrice;
    const minPrice = store.comboPrice; // 사업자가 허용한 최대할인가
    const discountCapacity = Math.max(0, originalPrice - minPrice);
    const appliedDiscount = Math.round(discountCapacity * rateInfo.rateRatio);
    const finalPrice = originalPrice - appliedDiscount;

    totalOriginalPrice += originalPrice;
    totalDiscountCapacity += discountCapacity;
    totalDiscountAmount += appliedDiscount;
    totalFinalPrice += finalPrice;

    return {
      storeId: store.id,
      storeName: store.storeName,
      category: store.category,
      itemName: store.itemName,
      imageUrl: store.imageUrl,
      address: store.address,
      originalPrice,
      minPrice,
      discountCapacity,
      appliedDiscount,
      finalPrice,
    };
  });

  return {
    itemCount,
    rateRatio: rateInfo.rateRatio,
    ratePercent: rateInfo.ratePercent,
    badgeLabel: rateInfo.badgeLabel,
    description: rateInfo.description,
    items,
    totalOriginalPrice,
    totalDiscountCapacity,
    totalDiscountAmount,
    totalFinalPrice,
  };
}

// Backward compatibility alias
export function getComboDiscountRate(stepCount: number) {
  const info = getMarginDiscountRate(stepCount);
  return {
    discountPercent: info.ratePercent,
    badgeLabel: info.badgeLabel,
  };
}
