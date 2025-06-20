---
marp: true
theme: default
---

# 프론트엔드 테스트의 종류

---

## 📋 목차

### 1. 테스트 피라미드 이해하기

### 2. 단위 테스트 (Unit Test)

### 3. 통합 테스트 (Integration Test)

### 4. E2E 테스트 (End-to-End Test)

---

## 🔺 테스트 피라미드

```
      /\     E2E 테스트 (느림, 비용 높음)
     /  \
    /____\   통합 테스트 (중간)
   /      \
  /________\ 단위 테스트 (빠름, 비용 낮음)
```

- 마틴 파울러 : 상위로 갈수록 비용이 크다. **밑으로 갈수록 많은 테스트**를 작성해라.
- **상단**: 소수의 E2E 테스트 (10%)
- **중간**: 적당한 통합 테스트 (20%)
- **하단**: 많은 단위 테스트 (70%)

---

## 🧩 1. 단위 테스트 (Unit Test)

클린 코드 저자 Bob Martin이 제시한 F.I.R.S.T 원칙

- Fast : 테스트는 빠르게 실행되어야 한다.
- Independent : 테스트는 서로 독립적이어야 한다. (다른테스트와 종속 X)
- Repeatable : 테스트는 반복 가능해야 한다. (항상 같은 결과를 낸다)
- Self-validating : 테스트는 자체적으로 검증되어야 한다.
- Timely : 테스트는 철저해야 하며 적시에 작성되어야 한다. (코드 작성 후 바로 작성)

---

### 예시 - 필수 약관 체크 테스트 (우아한 기술블로그 예시)

```javascript
// checkAllRequiredTerms.test.ts
describe("checkAllRequiredTerms()", () => {
  it("필수 약관이 모두 체크되어있어야 true를 반환한다", () => {
    const terms: Term[] = [
      { required: true, term: "약관 1", isChecked: true },
      { required: true, term: "약관 2", isChecked: true },
      { required: false, term: "약관 3", isChecked: false },
    ];

    expect(checkAllRequiredTerms(terms)).toEqual(true);
  });
  it("필수 약관 중 하나라도 체크되어있지 않으면 false를 반환한다", () => {
    /* ... */
  });
  it("필수 약관이 없으면 true를 반환한다", () => {
    /* ... */
  });
});
```

---

### 예시 - 약관 동의 체크 박스 (우아한 기술블로그 예시)

```javascript
// TermCheckBox.test.tsx
describe("<TermCheckBox />", () => {
  it("약관 체크박스를 클릭하면 onChange가 호출되고, 체크 상태가 바뀐다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn((isChecked: boolean) => {});
    render(
      <TermCheckBox
        required={true}
        isChecked={false}
        onChange={onChange}
        term="약관 4"
      />
    );

    const checkBox = screen.getByRole("checkbox");

    expect(screen.getByText("(필수) 약관 4")).toBeInTheDocument();
    expect(checkBox).not.toBeChecked();

    // 체크박스 클릭
    await user.click(checkBox);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(checkBox).toBeChecked();
  });
});
```

---

<!-- 여기까지 작성했음  -->

## 🔗 2. 통합 테스트 (Integration Test)

- 여러 컴포넌트나 모듈이 **함께** 작동하는 방식, 사용자 시나리오에 가까운 테스트 이 테스트는 일부 혹은 전체 시나리오가 될 수 있다.
- 함수와 컴포넌트 연동 테스트, 서버 연동 테스트(mock), 유저 인터랙션 테스트 정도로 나눌 수 있다.
- mocking을 이용하는 이유는 네트워크에 영향을 받지 않아 테스트가 안정적이고, 트래픽을 증가시키지 않고, 필요한 응답을 자유롭게 구성이 가능하기 때문이다.

---

# 🔴 주의 사항

- 적절한 수준의 테스트 분리는 필수 🚀
- 예시로 결제 시 포인트 시스템을 검증하는데 여기에 쿠폰이 들어가고 카드 할인이 들어가고...
- 이런 경우 중복된 테스트들을 과감히 제거하고 핵심이 아닌 케이스는 적절한 단위 테스트로 분리하는게 좋다. ✅

---

### 예시 - 필수 약관 체크 시 버튼 활성화 여부 (우아한 기술블로그 예시)

```javascript
// 정책: 필수 약관을 모두 선택하면 주문하기 버튼이 활성화 된다

// 전체 코드가 정책대로 잘 동작하는가?
export const OrderButtonSection = () => {
  // API 조회 후 받은 응답값을 매핑 후 반환
  const { terms, updateTerms } = useFetchTermQuery();
  const isCheckedAllRequiredTerms = checkAllRequiredTerms(terms);

  return (
    <footer>
      <TermList terms={terms} updateTerms={updateTerms} />
      <Button disabled={!isCheckedAllRequiredTerms}>주문하기</Button>
    </footer>
  );
};
```

---

### 예시 - 필수 약관 체크 시 버튼 활성화 여부 테스트 (우아한 기술블로그 예시)

```javascript
// OrderButtonSection.test.tsx
describe("<OrderButtonSection />", () => {
  it("필수 약관이 모두 체크되면 주문버튼이 활성화된다", async () => {
    const user = userEvent.setup();
    // 약관 조회 API 모킹
    mockFetchTermsAPI([
      { required: true, term: "약관 1" },
      { required: false, term: "약관 2" },
      { required: true, term: "약관 3" },
    ]);
    render(<OrderButtonSection />);

    // 서버 API를 불러올 때까지 대기
    const loader = screen.getByTestId("loader");
    await waitFor(() => expect(loader).not.toBeInTheDocument());

    const orderButton = screen.getByText("주문하기");
    expect(orderButton).toBeDisabled();

    // 필수 체크박스만 클릭
    const requiredCheckboxs = screen
      .getAllByRole("checkbox")
      .filter((checkBox) => checkBox.hasAttribute("required"));

    for (const checkbox of requiredCheckboxs) {
      await user.click(checkbox);
    }

    expect(orderButton).not.toBeDisabled();
  });
});
```

---

## 🎯 3. E2E 테스트 (End-to-End Test)

- **실제 브라우저**에서 사용자 관점의 전체 시나리오 테스트
- 가장 **현실적**이지만 느리고 복잡
- **Cypress, Playwright, Puppeteer** 등 사용

---

### 예시 - Cypress로 로그인 플로우 테스트 (실제론 더 복잡)

```javascript
// cypress/e2e/login.cy.js
describe("로그인 기능", () => {
  it("사용자가 올바른 정보로 로그인하면 홈으로 이동하고 유저명을 확인한다", () => {
    const username = "testuser";
    const password = "1234";

    // 로그인 페이지 진입
    cy.visit("/login");

    // 아이디 입력
    cy.get("input[name=username]").type(username);

    // 비밀번호 입력 후 엔터
    cy.get("input[name=password]").type(`${password}{enter}`);

    // 홈으로 리다이렉션 확인
    cy.url().should("include", "/home");

    // 유저명 표시 확인
    cy.get("[data-cy='login-success']").should("contain", username);
  });

  it("잘못된 정보로 로그인하면 에러 메시지가 표시된다", () => {
    cy.visit("/login");

    cy.get("input[name=username]").type("wronguser");
    cy.get("input[name=password]").type("wrongpassword{enter}");

    // 에러 메시지 확인
    cy.get("[data-cy='login-error']").should("contain", "로그인 실패");
    cy.url().should("include", "/login");
  });
});
```

---

### 🔧 Cypress 핵심 명령어

```javascript
// 요소 선택
cy.get("input[name=username]"); // name 속성으로 선택
cy.get(".btn"); // 클래스로 선택
cy.get("#submit"); // ID로 선택
cy.contains("로그인"); // 텍스트로 선택

// 액션
cy.type("텍스트{enter}"); // 입력 + 엔터
cy.click(); // 클릭
cy.visit("/login"); // 페이지 이동

// 검증
cy.should("contain", "유저명"); // 텍스트 포함 확인
cy.should("include", "/home"); // URL 포함 확인
cy.url().should("include", "/home"); // URL 검증
```

---

### 🔄 회귀 테스트 (Regression Test)

- 기존 기능이 새로운 변경으로 인해 망가지지 않았는지 확인, 기존 테스트 케이스를 반복 실행하여 기능 보장

### 🔥 스모크 테스트 (Smoke Test)

- 핵심 기능만 빠르게 검증하는 테스트 배포 후 "불이 나지 않는지" 기본 동작만 확인

### 🔍 정적 테스트 (Static Test)

- 코드를 실행하지 않고 분석하는 테스트 (TypeScript, ESLint), 가장 빠르고 저렴한 테스트

### 📸 스냅샷 테스트 (Snapshot Test)

- 컴포넌트 렌더링 결과를 스냅샷으로 저장하고 비교, 예상치 못한 컴포넌트 변경 감지

---

## 🎯 정리

- **정적 테스트**: 타입스크립트, 린터로 기본기 다지기
- **단위 테스트**: 함수, 컴포넌트 개별 검증 (70%)
- **통합 테스트**: 여러 모듈 협업 확인 (20%)
- **E2E 테스트**: 사용자 시나리오 전체 검증 (10%)
- **기타**: 스냅샷, 회귀, 스모크 테스트로 보완

**균형 잡힌 테스트 전략**이 핵심! 🚀
