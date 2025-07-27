# Nurse Off Scheduler (Firestore Name-Only Auth)

## Setup

1. Firebase 콘솔에서 새 프로젝트 생성
2. Firestore 데이터베이스 생성 (테스트 모드 또는 규칙 설정)
3. `users` 컬렉션은 자동으로 사용됩니다.

4. 프로젝트 설정 > 일반 탭 > 웹앱 추가 > Firebase SDK 설정 복사

5. `src/firebase.js`의 `firebaseConfig`를 복사한 구성으로 교체

## Run Locally

```bash
npm install
npm start
```
