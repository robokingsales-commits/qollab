/**
 * Recommendation & Activity Tracking Service for QOLLAB
 * 
 * - Cold Start (신규 가입자/DB 미축적): 가장 핫한 실시간 인기 검색어/제품 퀵필터 추천
 * - Personalized (활동 DB 축적): 검색어, 상품 클릭, 관심 카테고리 분석 후 개인 맞춤 검색어 추천
 */

export interface QuickFilterItem {
  id: string;
  label: string;
  query: string;
  category?: string;
  isPersonalized?: boolean;
}

export interface UserActivityDB {
  searches: { query: string; timestamp: number }[];
  viewedPackages: { id: string; title: string; category?: string; tags?: string[]; timestamp: number }[];
  categoryClicks: { category: string; count: number }[];
}

const STORAGE_KEY = "qollab_user_activity_db";

// Cold Start: 기본 실시간 인기 HOT 키워드 & 카테고리
export const COLD_START_HOT_FILTERS: QuickFilterItem[] = [
  { id: "hot-1", label: "🔥 CGV 팝콘 콤보", query: "CGV 팝콘 콤보" },
  { id: "hot-2", label: "🔥 성수동 루프탑 카페", query: "성수동 루프탑 카페" },
  { id: "hot-3", label: "🔥 1:1 두피 스파", query: "1:1 두피 스파" },
  { id: "hot-4", label: "🔥 수제맥주 & 타파스", query: "수제맥주 & 타파스" },
  { id: "hot-5", label: "🔥 올리브영 뷰티 바우처", query: "올리브영 뷰티 바우처" },
  { id: "hot-6", label: "🔥 연남동 브런치 베이커리", query: "연남동 브런치 베이커리" },
  { id: "hot-7", label: "🔥 여름 물놀이 패키지", query: "여름 물놀이 동산" },
];

// 개인화 연관 검색어 맵핑 규칙 (유저 검색/관심 키워드 기반 확장)
const PERSONALIZED_KEYWORD_RULES: { pattern: RegExp; recommendations: { label: string; query: string }[] }[] = [
  {
    pattern: /강아지|반려|애완|펫|간식|독/i,
    recommendations: [
      { label: "🐶 강아지 수제 간식", query: "강아지 수제 간식" },
      { label: "🐾 반려동물 스튜디오 & 케어", query: "반려동물 스튜디오" },
      { label: "🐕 펫 친화 카페 코스", query: "펫 친화 카페" },
    ],
  },
  {
    pattern: /맥주|술|타파스|바|재즈|호프|크래프트|펍/i,
    recommendations: [
      { label: "🍺 성수 수제 맥주 맛집", query: "수제 맥주 맛집" },
      { label: "🍷 분위기 클래식 재즈바", query: "클래식 재즈바" },
      { label: "🍻 크래프트 비어 & 와인 팩", query: "크래프트 비어" },
    ],
  },
  {
    pattern: /성수|성동|루프탑|카페|커피|브런치/i,
    recommendations: [
      { label: "☕ 성수 루프탑 로스터리", query: "성수 루프탑 카페" },
      { label: "🥐 감성 베이커리 브런치", query: "성수 베이커리 브런치" },
      { label: "🎨 성수 갤러리 카페 코스", query: "성수 갤러리 카페" },
    ],
  },
  {
    pattern: /뷰티|스파|헤어|두피|케어|마사지|피부/i,
    recommendations: [
      { label: "💆 1:1 프리미엄 두피 스파", query: "1:1 두피 스파" },
      { label: "✂️ K-뷰티 맞춤 헤어 살롱", query: "맞춤 헤어 케어" },
      { label: "💄 올리브영 뷰티 바우처", query: "올리브영 뷰티" },
    ],
  },
  {
    pattern: /영화|cgv|메가박스|문화|공연|전시/i,
    recommendations: [
      { label: "🎬 CGV 영화 2매 + 디저트", query: "CGV 영화 2매" },
      { label: "🎟️ 메가박스 팝콘 콤보 팩", query: "메가박스 팝콘 콤보" },
      { label: "🎨 주말 감성 전시 혜택", query: "주말 감성 전시" },
    ],
  },
];

/**
 * 로컬 사용자 활동 DB 읽기
 */
export function getUserActivityDB(): UserActivityDB {
  if (typeof window === "undefined") {
    return { searches: [], viewedPackages: [], categoryClicks: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { searches: [], viewedPackages: [], categoryClicks: [] };
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load user activity DB:", e);
    return { searches: [], viewedPackages: [], categoryClicks: [] };
  }
}

/**
 * 사용자 활동 DB 저장
 */
function saveUserActivityDB(db: UserActivityDB) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("Failed to save user activity DB:", e);
  }
}

/**
 * 검색어 기록 추가
 */
export function recordSearch(query: string) {
  if (!query.trim()) return;
  const clean = query.trim();
  const db = getUserActivityDB();

  // 중복 제거 후 최근 15개 유지
  const updatedSearches = [
    { query: clean, timestamp: Date.now() },
    ...db.searches.filter((s) => s.query !== clean),
  ].slice(0, 15);

  db.searches = updatedSearches;
  saveUserActivityDB(db);
}

/**
 * 패키지 상품 조회 기록 추가
 */
export function recordPackageView(pkg: { id: string; title: string; category?: string; tags?: string[] }) {
  const db = getUserActivityDB();
  const updatedViewed = [
    { id: pkg.id, title: pkg.title, category: pkg.category, tags: pkg.tags, timestamp: Date.now() },
    ...db.viewedPackages.filter((v) => v.id !== pkg.id),
  ].slice(0, 20);

  db.viewedPackages = updatedViewed;
  saveUserActivityDB(db);
}

/**
 * 카테고리 클릭 기록 추가
 */
export function recordCategoryClick(category: string) {
  const db = getUserActivityDB();
  const existingIndex = db.categoryClicks.findIndex((c) => c.category === category);
  if (existingIndex >= 0) {
    db.categoryClicks[existingIndex].count += 1;
  } else {
    db.categoryClicks.push({ category, count: 1 });
  }
  saveUserActivityDB(db);
}

/**
 * 활동 DB 축적 여부 판단 (Cold Start vs Personalized)
 */
export function isPersonalizedDB(): boolean {
  const db = getUserActivityDB();
  const totalActivityCount = db.searches.length + db.viewedPackages.length + db.categoryClicks.length;
  return totalActivityCount >= 1; // 활동 내역이 1개 이상 있으면 맞춤 추천 모드 활성화
}

/**
 * 추천 퀵필터 목록 산출 (핵심 알고리즘)
 */
export function getPersonalizedQuickFilters(): {
  isPersonalized: boolean;
  filters: QuickFilterItem[];
  badgeText: string;
} {
  const db = getUserActivityDB();
  const isPersonalized = isPersonalizedDB();

  if (!isPersonalized) {
    return {
      isPersonalized: false,
      filters: COLD_START_HOT_FILTERS,
      badgeText: "🔥 가장 핫한 인기 추천 (Cold-Start)",
    };
  }

  // 개인화 키워드 추출
  const personalizedMap = new Map<string, QuickFilterItem>();

  // 1. 최근 검색어 기반 맵핑 & 규칙 적용
  db.searches.forEach((s) => {
    // 규칙 맵핑 탐색
    for (const rule of PERSONALIZED_KEYWORD_RULES) {
      if (rule.pattern.test(s.query)) {
        rule.recommendations.forEach((rec) => {
          if (!personalizedMap.has(rec.query)) {
            personalizedMap.set(rec.query, {
              id: `custom-${rec.query}`,
              label: rec.label,
              query: rec.query,
              isPersonalized: true,
            });
          }
        });
      }
    }

    // 직전 직접 검색어도 키워드 칩으로 포함
    if (!personalizedMap.has(s.query)) {
      personalizedMap.set(s.query, {
        id: `search-${s.query}`,
        label: `✨ ${s.query}`,
        query: s.query,
        isPersonalized: true,
      });
    }
  });

  // 2. 조회 패키지 타이틀 기반 규칙 맵핑
  db.viewedPackages.forEach((pkg) => {
    for (const rule of PERSONALIZED_KEYWORD_RULES) {
      if (rule.pattern.test(pkg.title)) {
        rule.recommendations.forEach((rec) => {
          if (!personalizedMap.has(rec.query)) {
            personalizedMap.set(rec.query, {
              id: `pkgrec-${rec.query}`,
              label: rec.label,
              query: rec.query,
              isPersonalized: true,
            });
          }
        });
      }
    }
  });

  const generatedFilters = Array.from(personalizedMap.values());

  // 맞춤 키워드가 부족할 경우 Cold-Start 인기 키워드로 보충 (최소 6개)
  if (generatedFilters.length < 6) {
    COLD_START_HOT_FILTERS.forEach((hot) => {
      if (generatedFilters.length < 7 && !personalizedMap.has(hot.query)) {
        generatedFilters.push(hot);
      }
    });
  }

  return {
    isPersonalized: true,
    filters: generatedFilters.slice(0, 8),
    badgeText: "✨ 회원 DB 축적 맞춤 추천 (V.I.M Engine)",
  };
}

/**
 * DB 초기화 (테스트 및 Cold Start 리셋용)
 */
export function resetUserActivityDB() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("qollab_user_search_history");
}

/**
 * 테스트용 시뮬레이션 샘플 데이터 주입 (예: 반려동물 & 수제맥주 취향)
 */
export function injectSamplePetBeerDB() {
  const sampleDB: UserActivityDB = {
    searches: [
      { query: "강아지 수제 간식", timestamp: Date.now() - 10000 },
      { query: "성수동 수제맥주", timestamp: Date.now() - 5000 },
    ],
    viewedPackages: [
      {
        id: "pkg-local-2",
        title: "성수 수제맥주 & 타파스 + 클래식 아날로그 재즈바",
        category: "미식 & 코스",
        tags: ["수제맥주", "재즈바", "성수"],
        timestamp: Date.now() - 2000,
      },
    ],
    categoryClicks: [
      { category: "미식 & 코스", count: 3 },
      { category: "펫 & 패밀리", count: 2 },
    ],
  };
  saveUserActivityDB(sampleDB);
}
