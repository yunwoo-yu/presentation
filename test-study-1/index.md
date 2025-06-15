---
marp: true
theme: default
---

# 테스트 시작하기

- 테스트는 왜 필요할까 ?
- 테스트 코드 작성 패턴 (AAA, Given, When, Then)
- 간단 상황 예시 및 코드

---

## 🤔 테스트는 왜 필요할까?

### **장점** ✅

- **버그 조기 발견**: 배포 전에 문제를 미리 찾을 수 있어요
- **안심하고 코드 수정**: 기존 기능이 깨지는지 바로 알 수 있어요
- **문서 역할**: 코드가 어떻게 동작해야 하는지 작성자의 의도를 파악할 수 있어요

### **단점** ❌

- **개발 시간 증가**: 테스트 코드 작성에 추가 시간이 필요해요
- **유지보수 부담**: 코드 변경 시 테스트도 함께 수정해야 해요
- **초기 학습 비용**: 테스트 작성법을 배우는 데 시간이 걸려요

---

## 📝 테스트 코드 작성 패턴

### 🔥 AAA 패턴

<div class="pattern-box">

### **A**rrange (준비)

테스트에 필요한 데이터와 환경을 설정

### **A**ct (실행)

실제로 테스트하고 싶은 코드를 실행

### **A**ssert (검증)

결과가 예상한 것과 같은지 확인

</div>

**→ 코드 중심적이고 개발자 스러운 표현 (유닛테스트에 적합)**

---

## 📝 테스트 코드 작성 패턴

### 🌟 Given-When-Then 패턴

<div class="pattern-box">

### **Given** (주어진 상황)

초기 상태나 조건을 설명

### **When** (언제)

특정 행동이나 이벤트가 발생

### **Then** (그러면)

예상되는 결과나 상태 변화

</div>

**→ 더 자연스럽고 이야기처럼 표현 (행위 주도 개발(BDD)에 적합)**

---

## 🤔 두 패턴의 차이점

| AAA 패턴           | Given-When-Then            |
| ------------------ | -------------------------- |
| 코드 구조 중심     | 시나리오 중심              |
| 개발자 친화적      | 비개발자도 이해 쉬움       |
| 단위 테스트에 적합 | BDD(행동 주도 개발)에 적합 |

- **준비, 실행, 검증으로 동일한 3패턴으로 본질은 같다.**
- 개발자에게 친숙한 방식과 아닌 사람에게도 친숙한 패턴으로 나뉠뿐

---

## 💻 간단 상황 예시 및 코드

```javascript
// 여러 곳에서 사용하는 공통 함수
function getShippingFee(orderAmount) {
  //  배송비가 30000원 이상이면 무료배송 아니면 3000원
  if (orderAmount >= 30000) {
    return 0; // 무료배송
  }

  return 3000; // 배송비 3천원
}
```

**사용하는 곳들:**

- **상품 상세 페이지**: "배송비 **3,000**원 (3만원 이상 무료)" 안내
- **장바구니 페이지**: 예상 배송비 **3,000**원 총 금액에 반영
- **주문서 페이지**: 실제 결제할 배송비 **3,000**원 계산

---

## 📋 **상품 상세 페이지 변경 요구사항**

"상품 상세 페이지에서 무료배송까지 얼마 남았는지 보여주고 싶어요!"

### **히스토리를 모르는 상태로 함수 수정**

```javascript
function getShippingFee(orderAmount) {
  if (orderAmount >= 30000) {
    return 0; // 무료배송
  }

  // 상품 상세 페이지를 위한 추가 로직
  const remaining = 30000 - orderAmount;

  return `배송비 3,000원 (${remaining.toLocaleString()}원 더 담으면 무료배송!)`;
}
```

---

## 😱 문제 발생

### **배포 후 발견된 문제들**

1. **장바구니 페이지**: 총 금액 계산이 "NaN"으로 표시됨
2. **주문서 페이지**: 결제 버튼 클릭 시 오류 발생
3. **고객센터 폭주**: "장바구니에서 결제가 안 돼요!"
4. **개발팀 긴급 회의**: "왜 갑자기 모든 결제가 실패하지?"

### **원인 파악**: 공통 함수를 수정했다는 걸 몰랐음 😵

---

## ✅ 만약 테스트가 있었다면?

```javascript
test("장바구니 배송비 계산", () => {
  const shippingFee = getShippingFee(25000);
  const totalPrice = 25000 + shippingFee; // 숫자 계산이어야 함

  expect(totalPrice).toBe(28000);
});

test("주문서 결제 금액 계산", () => {
  const shippingFee = getShippingFee(25000);

  expect(typeof shippingFee).toBe("number"); // 반드시 숫자여야 함
  expect(shippingFee).toBe(3000);
});

test("배송비 반환 타입 검증", () => {
  expect(typeof getShippingFee(25000)).toBe("number");
  expect(typeof getShippingFee(35000)).toBe("number");
});
```

---

### **함수 수정 후 테스트 실행했다면**

```
❌ 장바구니 배송비 계산 FAILED
   Expected: 28000
   Received: NaN

❌ 주문서 결제 금액 계산 FAILED
   Expected: "number"
   Received: "string"

❌ 배송비 반환 타입 검증 FAILED
   Expected: "number"
   Received: "string"
```

**배포 전에 문제를 발견했을 것!** 🛡️

---

## 🔧 AAA 패턴으로 작성

```javascript
test("배송비를 올바르게 계산한다", () => {
  // Arrange (준비)
  const orderAmount = 25000;
  const expectedFee = 3000;

  // Act (실행)
  const result = getShippingFee(orderAmount);

  // Assert (검증)
  expect(result).toBe(expectedFee);
});
```

---

## 🎯 Given-When-Then 패턴으로 작성

```javascript
test("주문 금액에 따른 배송비 계산", () => {
  // Given: 고객이 2만5천원 주문했을 때
  const orderAmount = 25000;

  // When: 배송비 계산 함수를 실행하면
  const result = getShippingFee(orderAmount);

  // Then: 배송비 3000원이 반환된다
  expect(result).toBe(3000);
});
```

---

## 🎉 마무리하며

- **테스트는 보험**: 버그 발생 or 사이드 이펙트를 미리 방지할 수 있어요✅
- **간단한 것부터**: 꼭 전체적인 비즈니스 로직이 아닌 간단한 함수부터 시작해도 충분해요✅
