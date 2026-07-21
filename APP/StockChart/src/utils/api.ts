import type { BarData } from './math';

export interface SearchResult {
  symbol: string;
  name: string;
  type: string; // 'EQUITY' | 'ETF' | 'CRYPTOCURRENCY' 등
  exchange: string;
}

/**
 * Vite 로컬 개발 서버 프록시(/api-yahoo)를 통한 고속 API 통신
 */
async function fetchApi(path: string): Promise<any> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`API 통신 장애 (Status: ${res.status})`);
  }
  return await res.json();
}

/**
 * 1시간봉(1h) 데이터를 N개씩 묶어 2시간봉(2h) 또는 4시간봉(4h)으로 가공
 */
function aggregateBars(bars: BarData[], factor: number): BarData[] {
  if (factor <= 1 || bars.length === 0) return bars;
  
  const result: BarData[] = [];
  
  for (let i = 0; i < bars.length; i += factor) {
    const chunk = bars.slice(i, i + factor);
    if (chunk.length === 0) continue;
    
    const first = chunk[0];
    const last = chunk[chunk.length - 1];
    
    let high = -Infinity;
    let low = Infinity;
    
    chunk.forEach(bar => {
      if (bar.high > high) high = bar.high;
      if (bar.low < low) low = bar.low;
    });
    
    result.push({
      time: last.time,
      open: first.open,
      high,
      low,
      close: last.close
    });
  }
  
  return result;
}

/**
 * 야후 파이낸스로부터 주식/ETF의 봉차트 데이터 가져오기 (시간외 거래 및 초고속 로컬 프록시 적용)
 * @param symbol 주식 티커 (예: AAPL, SPY, 005930.KS)
 * @param interval 주기 ('1m' | '5m' | '15m' | '1h' | '2h' | '4h' | '1d' | '1wk' | '1mo')
 */
export async function fetchYahooStockData(symbol: string, interval: string): Promise<BarData[]> {
  let cleanSymbol = symbol.trim().toUpperCase();
  if (/^\d{6}$/.test(cleanSymbol)) {
    cleanSymbol = `${cleanSymbol}.KS`;
  }

  let yahooInterval = interval;
  let range = '1y'; 
  let aggregateFactor = 1;

  switch (interval) {
    case '1m':
      yahooInterval = '1m';
      range = '1d';
      break;
    case '5m':
      yahooInterval = '5m';
      range = '5d';
      break;
    case '15m':
      yahooInterval = '15m';
      range = '5d';
      break;
    case '1h':
      yahooInterval = '1h';
      range = '1mo';
      break;
    case '2h':
      yahooInterval = '1h';
      range = '2mo';
      aggregateFactor = 2;
      break;
    case '4h':
      yahooInterval = '1h';
      range = '3mo';
      aggregateFactor = 4;
      break;
    case '1d':
      yahooInterval = '1d';
      range = '1y';
      break;
    case '1wk':
      yahooInterval = '1wk';
      range = '2y';
      break;
    case '1mo':
      yahooInterval = '1mo';
      range = '5y';
      break;
  }

  // /api-yahoo로 시작하여 Vite 개발서버의 Proxy 우회 태움 (CORS 방지 및 초고속 통신)
  const url = `/api-yahoo/v8/finance/chart/${cleanSymbol}?range=${range}&interval=${yahooInterval}&includePrePost=true`;
  
  const data = await fetchApi(url);
  
  const result = data.chart?.result?.[0];
  if (!result) {
    throw new Error(`차트 데이터를 찾을 수 없습니다. (Symbol: ${cleanSymbol})`);
  }

  const timestamps = result.timestamp || [];
  const indicators = result.indicators?.quote?.[0] || {};
  const opens = indicators.open || [];
  const highs = indicators.high || [];
  const lows = indicators.low || [];
  const closes = indicators.close || [];

  const rawBars: BarData[] = [];
  let lastClose: number | null = null;

  for (let i = 0; i < timestamps.length; i++) {
    let o = opens[i];
    let h = highs[i];
    let l = lows[i];
    let c = closes[i];

    // 시간외 거래 등 누락된 데이터 보정 (Forward Fill)
    if (
      o === null || o === undefined ||
      h === null || h === undefined ||
      l === null || l === undefined ||
      c === null || c === undefined
    ) {
      if (lastClose !== null) {
        o = lastClose;
        h = lastClose;
        l = lastClose;
        c = lastClose;
      } else {
        continue;
      }
    }

    lastClose = c;
    const date = new Date(timestamps[i] * 1000);
    
    let timeVal: string | number;
    if (interval === '1d' || interval === '1wk' || interval === '1mo') {
      timeVal = date.toISOString().split('T')[0];
    } else {
      timeVal = timestamps[i];
    }

    rawBars.push({
      time: timeVal,
      open: Number(o.toFixed(2)),
      high: Number(h.toFixed(2)),
      low: Number(l.toFixed(2)),
      close: Number(c.toFixed(2))
    });
  }

  return aggregateBars(rawBars, aggregateFactor);
}

/**
 * 야후 파이낸스 실시간 주식 및 ETF 검색
 * @param query 검색 쿼리
 */
export async function searchYahooStocks(query: string): Promise<SearchResult[]> {
  const cleaned = query.trim();
  if (!cleaned) return [];

  let searchQuery = cleaned;
  if (/^\d{6}$/.test(cleaned)) {
    searchQuery = `${cleaned}.KS`;
  }

  const url = `/api-yahoo/v1/finance/search?q=${encodeURIComponent(searchQuery)}&newsCount=0`;
  
  try {
    const data = await fetchApi(url);
    const quotes = data.quotes || [];
    
    return quotes
      .filter((q: any) => q.symbol)
      .map((q: any) => ({
        symbol: q.symbol,
        name: q.longname || q.shortname || q.symbol,
        type: q.quoteType || 'STOCK',
        exchange: q.exchange
      }));
  } catch (err) {
    console.error("Stock search error:", err);
    return [];
  }
}
