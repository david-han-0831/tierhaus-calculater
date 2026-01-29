# 반려동물 간식 수익률 계산기

Next.js + Firebase 기반의 반려동물 간식(오리 장각 등) 수익률 계산 웹 앱입니다. Google 로그인 후 원물·생산제품을 관리하고, 주문량·생산량을 입력해 예상 지출과 기대 수익을 실시간으로 계산할 수 있습니다.

---

## 주요 기능

- **수익률 계산**  
  상품 선택 → 원가 주문량·생산량 입력 → 원물비·포장비·부가세·택배비 반영 실시간 수익률 계산. 계산 결과 영역 스크린샷 저장 지원.

- **설정**
  - **원물 관리**: 원물 CRUD (이름, 단위, 단가). 시드 데이터 불러오기.
  - **생산제품 관리**: 제품 CRUD (이름, 단위, 판매 단가, 포장비·잡비). 원물 연결, 시드 데이터 불러오기.
  - **지출 설정**: 택배비 등 기본 지출 값 설정 (부가세 10% 고정).

- **인증·권한**  
  Firebase Auth Google 로그인. 관리자만 대시보드·설정 접근 가능.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend / DB | Firebase Authentication, Firestore |
| 기타 | html2canvas (스크린샷) |

---

## 환경 설정

1. 저장소 클론 후 의존성 설치:

```bash
npm install
```

2. Firebase 프로젝트를 만들고, **Authentication**에서 Google 로그인을 활성화합니다.

3. 프로젝트 루트에 `.env.local` 파일을 만들고 아래 변수를 채웁니다 (Firebase 콘솔 > 프로젝트 설정 > 일반):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

4. Firestore 보안 규칙은 `firestore.rules`를 참고해 Firebase 콘솔에 배포합니다. 관리자 사용자는 `users/{uid}` 문서에 `role: "admin"`이 있어야 설정·대시보드 접근이 가능합니다.

---

## 실행

```bash
# 개발 서버 (기본 http://localhost:3000)
npm run dev

# 프로덕션 빌드 후 실행
npm run build
npm start
```

---

## 프로젝트 구조 (요약)

```
app/
  dashboard/          # 대시보드 (인증 필요)
    calculator/       # 수익률 계산
    settings/         # 원물·생산제품·지출 설정
  login/              # Google 로그인
components/           # 레이아웃, 모달, 가드
contexts/             # AuthContext
lib/                  # Firebase 초기화, Firestore CRUD, 시드 데이터
firestore.rules       # Firestore 보안 규칙
```

---

## 라이선스

Private. 이 프로젝트는 개인/내부 사용 목적입니다.
