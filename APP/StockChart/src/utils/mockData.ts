import type { BarData } from './math';

export interface StockItem {
  symbol: string;
  nameKo: string;
  nameEn: string;
  price: number;
  changeRate: number;
  type: 'growth' | 'cyclical' | 'volatile' | 'steady';
}

export const mockStocks: StockItem[] = [
  { symbol: 'TSLA', nameKo: '테슬라', nameEn: 'Tesla Inc.', price: 242.50, changeRate: 3.45, type: 'volatile' },
  { symbol: 'AAPL', nameKo: '애플', nameEn: 'Apple Inc.', price: 189.80, changeRate: -0.75, type: 'steady' },
  { symbol: 'NVDA', nameKo: '엔비디아', nameEn: 'NVIDIA Corp.', price: 475.20, changeRate: 5.82, type: 'growth' },
  { symbol: 'MSFT', nameKo: '마이크로소프트', nameEn: 'Microsoft Corp.', price: 378.90, changeRate: 1.12, type: 'steady' },
  { symbol: '005930', nameKo: '삼성전자', nameEn: 'Samsung Electronics', price: 74200, changeRate: -1.20, type: 'cyclical' },
  { symbol: '000660', nameKo: 'SK하이닉스', nameEn: 'SK hynix', price: 135400, changeRate: 2.15, type: 'volatile' },
  { symbol: 'AMZN', nameKo: '아마존', nameEn: 'Amazon.com Inc.', price: 154.30, changeRate: 0.85, type: 'growth' },
  { symbol: 'BTCUSD', nameKo: '비트코인', nameEn: 'Bitcoin USD', price: 67200, changeRate: -2.40, type: 'volatile' }
];

/**
 * 주식 검색
 */
export function searchStocks(query: string): StockItem[] {
  const cleaned = query.trim().toLowerCase();
  if (!cleaned) return mockStocks.slice(0, 5);
  
  return mockStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(cleaned) ||
    stock.nameKo.toLowerCase().includes(cleaned) ||
    stock.nameEn.toLowerCase().includes(cleaned)
  );
}

/**
 * 특정 주식의 특징에 따라 고품질 모의 차트 데이터 생성
 * @param symbol 주식 심볼
 * @param points 데이터 포인트(일수)
 */
export function generateMockChartData(symbol: string, points: number = 100): BarData[] {
  const stock = mockStocks.find(s => s.symbol === symbol) || mockStocks[0];
  
  let price = stock.price;
  const data: BarData[] = [];
  
  const now = new Date();
  
  // 주가 특성에 따른 변동성(volatility)과 추세(trend) 계수 설정
  let trend = 0;
  let volatility = 0.02; // 기본 변동성 2%
  
  switch (stock.type) {
    case 'growth':
      trend = 0.002; // 우상향
      volatility = 0.025;
      break;
    case 'steady':
      trend = 0.0005; // 완만한 우상향
      volatility = 0.012;
      break;
    case 'volatile':
      trend = 0.001;
      volatility = 0.04; // 높은 변동성
      break;
    case 'cyclical':
      trend = 0.0001;
      volatility = 0.018;
      break;
  }

  // 역순으로 날짜를 계산해 차트 데이터 생성
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // YYYY-MM-DD 형식 시간
    const timeStr = date.toISOString().split('T')[0];

    // 주기적 파동(사이클)을 추가하여 피보나치와 빗각 채널이 예쁘게 형성되도록 유도
    const cycleEffect = Math.sin(i * 0.1) * (price * volatility * 0.8);
    const noise = (Math.random() - 0.5) * (price * volatility);
    
    // 점진적 가격 계산
    const change = price * trend + cycleEffect * 0.05 + noise;
    const open = price;
    const close = price + change;
    
    // 고점, 저점 계산
    const high = Math.max(open, close) + Math.random() * (price * volatility * 0.5);
    const low = Math.min(open, close) - Math.random() * (price * volatility * 0.5);

    data.push({
      time: timeStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2))
    });

    // 다음 봉을 위한 주가 갱신
    price = close;
  }

  return data;
}
