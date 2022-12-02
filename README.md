## 기본 세팅하기

### 타입스크립트를 사용하는 이유

자바스크립트를 타입스크립트로 바꾸면 안전성이 높아짐, 그러나 자유도는 줄어듦
그러나, 에러가 안나는 것이 중요!

### tsc의 역할

1. 타입스크립트 코드를 자바스크립트로 변환해주는 역할을 한다.
2. 코드 자체에 타입 검사를 해준다.

### tsconfig.json 생성

```bash
npx tsc --init
```

- `allwoJs:true` : 만약 자바스크립트와 타입스크립트를 동시에 쓰고 싶다면 설정 추가
- `target`: 변환하고자 하는 타입스크립트 버전을 설정하는 속성
- `forceConsistentCasingInFileNames` : 대소문자 지켜서 import 할 수 있게 하는 속성
- `skipLibCheck` : 라이브러리 타입 파일(.d.ts)들 검사 넘기는 속성

**타입검사 기능과 코드 변환 기능은 각각 별개이다**
- `npx tsc` : TS -> JS 변환 명령어
- `npx tsc --noemit`: 코드 타입 검사 명령어
