// 사용자 구분 타입
export enum UserType {
  ADMIN = "ADMIN", // 시스템관리자
  MANAGER = "MANAGER", // 관리자
  USER = "USER", // 사용자
}

// 포인트 구분 타입
export enum PointType {
  RECEIVED = "RECEIVED", // 받은 포인트
  AVAILABLE = "AVAILABLE", // 줄 수 있는 포인트
}

// 포인트 사유 구분 타입
export enum PointReasonCode {
  GOOD_WORK = "GOOD_WORK", // 업무 잘함
  COOPERATION = "COOPERATION", // 협조 잘함
  INNOVATION = "INNOVATION", // 혁신적 제안
  HELP_OTHERS = "HELP_OTHERS", // 동료 도움
  ACHIEVEMENT = "ACHIEVEMENT", // 성과 달성
  OTHER = "OTHER", // 기타
}
