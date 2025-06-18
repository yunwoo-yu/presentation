// ===== 실제 구현체 =====

// 1. 필수 약관 체크 함수
function checkAllRequiredTerms(terms) {
  const requiredTerms = terms.filter((term) => term.required);
  return requiredTerms.every((term) => term.isChecked);
}

// 2. 유틸 함수들
function formatCurrency(amount) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===== 실제 Jest 테스트 =====

describe("checkAllRequiredTerms()", () => {
  test("필수 약관이 모두 체크되어있어야 true를 반환한다", () => {
    const terms = [
      { required: true, term: "약관 1", isChecked: true },
      { required: true, term: "약관 2", isChecked: true },
      { required: false, term: "약관 3", isChecked: false },
    ];

    expect(checkAllRequiredTerms(terms)).toBe(true);
  });

  test("필수 약관 중 하나라도 체크되어있지 않으면 false를 반환한다", () => {
    const terms = [
      { required: true, term: "약관 1", isChecked: true },
      { required: true, term: "약관 2", isChecked: false }, // 체크 안됨
      { required: false, term: "약관 3", isChecked: false },
    ];

    expect(checkAllRequiredTerms(terms)).toBe(false);
  });

  test("필수 약관이 없으면 true를 반환한다", () => {
    const terms = [
      { required: false, term: "약관 1", isChecked: false },
      { required: false, term: "약관 2", isChecked: true },
    ];

    expect(checkAllRequiredTerms(terms)).toBe(true);
  });

  test("빈 배열은 모든 필수 약관이 체크된 것으로 간주한다", () => {
    expect(checkAllRequiredTerms([])).toBe(true);
  });
});

describe("formatCurrency", () => {
  test("숫자를 한국 원화 형식으로 변환한다", () => {
    expect(formatCurrency(10000)).toBe("₩10,000");
    expect(formatCurrency(0)).toBe("₩0");
  });

  test("큰 금액도 올바르게 포맷팅한다", () => {
    expect(formatCurrency(1234567890)).toBe("₩1,234,567,890");
  });
});

describe("validateEmail", () => {
  test("유효한 이메일 주소를 검증한다", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });

  test("다양한 이메일 형식을 검증한다", () => {
    expect(validateEmail("user.name@example.com")).toBe(true);
    expect(validateEmail("user+tag@example.co.kr")).toBe(true);
    expect(validateEmail("@example.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
  });
});

// Jest 테스트 완료!
