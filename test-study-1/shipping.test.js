// =====================================
// 배송비 계산 함수 (여러 곳에서 사용하는 공통 함수)
// =====================================

// function getShippingFee(orderAmount) {
//   if (orderAmount >= 30000) {
//     return 0; // 무료배송
//   }
//   return 3000; // 배송비 3천원
// }

function getShippingFee(orderAmount) {
  if (orderAmount >= 30000) {
    return 0; // 무료배송
  }

  // 상품 상세 페이지를 위한 추가 로직
  const remaining = 30000 - orderAmount;

  return `배송비 3,000원 (${remaining.toLocaleString()}원 더 담으면 무료배송!)`;
}

// =====================================
// Jest 테스트들
// =====================================

describe("🚚 배송비 계산", () => {
  test("3만원 미만은 배송비 3000원", () => {
    expect(getShippingFee(25000)).toBe(3000);
    expect(getShippingFee(29999)).toBe(3000);
  });

  test("3만원 이상은 무료배송", () => {
    expect(getShippingFee(30000)).toBe(0);
    expect(getShippingFee(50000)).toBe(0);
  });

  test("장바구니 총 금액 계산", () => {
    const orderAmount = 25000;
    const shippingFee = getShippingFee(orderAmount);
    const totalPrice = orderAmount + shippingFee;

    expect(totalPrice).toBe(28000); // 25000 + 3000
    expect(typeof totalPrice).toBe("number"); // 숫자 계산이어야 함
  });

  test("배송비 반환 타입 검증", () => {
    expect(typeof getShippingFee(25000)).toBe("number");
    expect(typeof getShippingFee(35000)).toBe("number");
  });

  // AAA 패턴 예시
  test("AAA 패턴으로 배송비 테스트", () => {
    // Arrange (준비)
    const orderAmount = 25000;

    // Act (실행)
    const result = getShippingFee(orderAmount);

    // Assert (검증)
    expect(result).toBe(3000);
  });

  // Given-When-Then 패턴 예시
  test("Given-When-Then 패턴으로 무료배송 테스트", () => {
    // Given: 고객이 3만원 이상 주문했을 때
    const orderAmount = 35000;

    // When: 배송비를 계산하면
    const result = getShippingFee(orderAmount);

    // Then: 무료배송(0원)이 반환된다
    expect(result).toBe(0);
  });
});

// 모듈 내보내기
module.exports = {
  getShippingFee,
};
