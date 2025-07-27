# Nurse Off Scheduler (Firebase Version)

## 1. Firebase 설정

1. Firebase 콘솔(https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication → 이메일/비밀번호(Sign-in method) 활성화 (이름 대신 이메일 사용)
3. Firestore 데이터베이스 생성(테스트 모드 또는 규칙 설정 후 생성)
4. 프로젝트 설정(톱니바퀴) → "일반" 탭의 Firebase SDK 설정에서 웹 앱 추가
5. 아래 `src/firebase.js`의 `firebaseConfig` 객체를 복사하여 붙여넣기

## 2. 설치 및 실행

```bash
npm install
npm start
```

- React 개발 서버: http://localhost:3000
