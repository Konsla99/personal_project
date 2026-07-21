export interface BarData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  value?: number; // 거래량 등 추가 데이터용
}

export interface FibonacciLevels {
  high: number;
  low: number;
  levels: {
    ratio: number;
    price: number;
    color: string;
  }[];
}

export interface ChannelLine {
  startX: number; // 데이터 인덱스 기준 시작점
  startY: number;
  endX: number;
  endY: number;
}

export interface TrendChannel {
  slope: number;
  intercept: number;
  upperIntercept: number;
  lowerIntercept: number;
  startIndex: number;
  endIndex: number;
}

/**
 * 피보나치 되돌림 비율 계산
 * @param data 최근 N개 봉 데이터
 * @param lookbackPeriod 분석할 최근 봉 개수
 */
export function calculateFibonacci(data: BarData[], lookbackPeriod: number = 50): FibonacciLevels | null {
  if (data.length < 2) return null;
  const analysisData = data.slice(-Math.min(data.length, lookbackPeriod));
  
  let high = -Infinity;
  let low = Infinity;

  analysisData.forEach((bar) => {
    if (bar.high > high) {
      high = bar.high;
    }
    if (bar.low < low) {
      low = bar.low;
    }
  });

  // 상승 추세인지 하락 추세인지에 따라 순서가 달라질 수 있지만, 되돌림 비율 자체는 동일한 레벨을 가집니다.
  const diff = high - low;
  const ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  
  // 피보나치 색상 정의 (네온 컬러)
  const colors = [
    '#ff4a4a', // 0% (최고점 또는 최저점)
    '#ff9f43', // 23.6%
    '#10ac84', // 38.2%
    '#00d2d3', // 50.0%
    '#54a0ff', // 61.8%
    '#5f27cd', // 78.6%
    '#ee5253'  // 100%
  ];

  const levels = ratios.map((ratio, idx) => {
    // 저점 대비 되돌림 기준 (또는 고점 대비)
    const price = high - diff * ratio;
    return {
      ratio,
      price,
      color: colors[idx]
    };
  });

  return {
    high,
    low,
    levels
  };
}

/**
 * 선형 회귀 분석을 이용한 자동 빗각 채널(Trend Channel) 계산
 * @param data 최근 N개 봉 데이터
 * @param lookbackPeriod 분석할 최근 봉 개수
 */
export function calculateTrendChannel(data: BarData[], lookbackPeriod: number = 40): TrendChannel | null {
  const len = data.length;
  if (len < 10) return null;

  const actualLookback = Math.min(len, lookbackPeriod);
  const startIndex = len - actualLookback;
  const endIndex = len - 1;
  const subset = data.slice(startIndex);

  // x는 인덱스 (0 ~ actualLookback-1)
  // y는 고점/저점의 중간값인 (high + low) / 2 또는 종가(close) 사용. 여기선 종가 기준 추세 분석
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  const n = subset.length;
  subset.forEach((bar, i) => {
    const x = i;
    const y = bar.close;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  // 기울기 m 및 y절편 c 계산 (y = mx + c)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // 상단 및 하단 경계선 탐색을 위해 편차(residual) 계산
  let maxResidual = -Infinity;
  let minResidual = Infinity;

  subset.forEach((bar, i) => {
    const x = i;
    const expectedY = slope * x + intercept;
    
    // 상단 채널선은 고점(high) 기준 최대 오차 적용
    const upperResidual = bar.high - expectedY;
    if (upperResidual > maxResidual) {
      maxResidual = upperResidual;
    }

    // 하단 채널선은 저점(low) 기준 최소 오차 적용
    const lowerResidual = bar.low - expectedY;
    if (lowerResidual < minResidual) {
      minResidual = lowerResidual;
    }
  });

  // 상단 및 하단 채널의 y절편
  const upperIntercept = intercept + maxResidual;
  const lowerIntercept = intercept + minResidual;

  return {
    slope,
    intercept,
    upperIntercept,
    lowerIntercept,
    startIndex,
    endIndex
  };
}
