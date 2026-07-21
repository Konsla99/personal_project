import React, { useState, useEffect } from 'react';
import { AreaChart, LayoutGrid, Grid2X2, Maximize, AlertCircle, Loader2 } from 'lucide-react';
import { SearchBar } from './components/SearchBar/SearchBar';
import { StockChart } from './components/StockChart/StockChart';
import { IndicatorPanel } from './components/IndicatorPanel/IndicatorPanel';
import { fetchYahooStockData, type SearchResult } from './utils/api';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { BarData } from './utils/math';

interface ChartSlot {
  id: number;
  symbol: string;
  name: string;
  interval: string;
  data: BarData[];
  showFibonacci: boolean;
  fibLookback: number;
  showChannel: boolean;
  channelLookback: number;
  loading: boolean;
  error: string | null;
}

const INITIAL_SLOTS: ChartSlot[] = [
  {
    id: 1,
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    interval: '1d',
    data: [],
    showFibonacci: true,
    fibLookback: 55,
    showChannel: true,
    channelLookback: 40,
    loading: false,
    error: null
  },
  {
    id: 2,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    interval: '1d',
    data: [],
    showFibonacci: true,
    fibLookback: 55,
    showChannel: true,
    channelLookback: 40,
    loading: false,
    error: null
  },
  {
    id: 3,
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    interval: '1d',
    data: [],
    showFibonacci: true,
    fibLookback: 55,
    showChannel: true,
    channelLookback: 40,
    loading: false,
    error: null
  },
  {
    id: 4,
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    interval: '1d',
    data: [],
    showFibonacci: true,
    fibLookback: 55,
    showChannel: true,
    channelLookback: 40,
    loading: false,
    error: null
  }
];

export const App: React.FC = () => {
  // 1. 상태 정의
  const [slots, setSlots] = useState<ChartSlot[]>(INITIAL_SLOTS);
  const [activeSlotId, setActiveSlotId] = useState<number>(1);
  const [layoutMode, setLayoutMode] = useState<'1' | '2' | '4'>('1');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // 2. 개별 슬롯 데이터 로드 함수 (처음 로드 시 전체 화면 스피너 작동)
  const loadSlotData = async (id: number, symbol: string, interval: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, loading: true, error: null } : s));
    try {
      const fetchedData = await fetchYahooStockData(symbol, interval);
      setSlots(prev => prev.map(s => s.id === id ? { ...s, data: fetchedData, loading: false } : s));
      updateRefreshTime();
    } catch (err: any) {
      console.error(`Failed to load data for slot ${id} (${symbol}):`, err);
      setSlots(prev => prev.map(s => s.id === id ? { 
        ...s, 
        data: [], 
        loading: false, 
        error: err.message || '데이터를 불러오는 중 오류가 발생했습니다.' 
      } : s));
    }
  };

  // 3. 백그라운드 실시간 갱신 함수 (로딩 스피너를 띄우지 않고 데이터만 자연스럽게 교체)
  const refreshSlotData = async (id: number, symbol: string, interval: string) => {
    try {
      const fetchedData = await fetchYahooStockData(symbol, interval);
      setSlots(prev => prev.map(s => s.id === id ? { ...s, data: fetchedData, error: null } : s));
      updateRefreshTime();
    } catch (err: any) {
      console.warn(`Auto-refresh failed for slot ${id} (${symbol}):`, err);
    }
  };

  const updateRefreshTime = () => {
    const now = new Date();
    setLastRefreshed(now.toLocaleTimeString('ko-KR'));
  };

  // 레이아웃 모드에 따라 노출할 슬롯 필터링
  const getVisibleSlots = () => {
    if (layoutMode === '1') return slots.slice(0, 1);
    if (layoutMode === '2') return slots.slice(0, 2);
    return slots;
  };

  // 4. 컴포넌트 마운트 및 종목/레이아웃 변경 시 실시간 엔진 제어
  useEffect(() => {
    // 4.1 전체 슬롯 초기 강제 로드
    slots.forEach(slot => {
      if (slot.data.length === 0) {
        loadSlotData(slot.id, slot.symbol, slot.interval);
      }
    });

    // 4.2 15초 주기의 백그라운드 폴링 리프레시 개시
    const timerId = setInterval(() => {
      const visible = getVisibleSlots();
      visible.forEach(slot => {
        if (!slot.loading) {
          refreshSlotData(slot.id, slot.symbol, slot.interval);
        }
      });
    }, 15000);

    return () => clearInterval(timerId);
  }, [layoutMode, slots.map(s => `${s.id}-${s.symbol}-${s.interval}`).join(',')]);

  // 5. 활성화된 슬롯의 주식 변경 핸들러
  const handleSelectStock = (stock: SearchResult) => {
    const activeSlot = slots.find(s => s.id === activeSlotId);
    if (!activeSlot) return;

    setSlots(prev => prev.map(s => s.id === activeSlotId ? { 
      ...s, 
      symbol: stock.symbol, 
      name: stock.name 
    } : s));

    loadSlotData(activeSlotId, stock.symbol, activeSlot.interval);
  };

  // 6. 활성화된 슬롯의 속성(주기 등) 변경 핸들러
  const handleIntervalChange = (id: number, newInterval: string) => {
    const slot = slots.find(s => s.id === id);
    if (!slot) return;

    setSlots(prev => prev.map(s => s.id === id ? { ...s, interval: newInterval } : s));
    loadSlotData(id, slot.symbol, newInterval);
  };

  const updateActiveSlotSettings = (updates: Partial<ChartSlot>) => {
    setSlots(prev => prev.map(s => s.id === activeSlotId ? { ...s, ...updates } : s));
  };

  const activeSlot = slots.find(s => s.id === activeSlotId) || slots[0];
  const visibleSlots = getVisibleSlots();

  return (
    <div className="app-container">
      {/* 헤더 영역 */}
      <header className="app-header">
        <div className="brand-section">
          <h1 className="brand-title">
            <AreaChart size={28} /> StockChart Pro
          </h1>
          <span className="brand-subtitle">실시간 주식/ETF 분석 및 멀티 차트 레이아웃</span>
        </div>

        {/* 현재 활성 슬롯 대상 검색 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            [차트 {activeSlotId}] 제어 중
          </span>
          <SearchBar onSelectStock={handleSelectStock} />
        </div>
      </header>

      {/* 대시보드 상단 제어 바 (화면 분할 및 실시간 갱신 표시) */}
      <div className="dashboard-control-bar">
        <div className="layout-buttons">
          <button 
            className={`control-btn ${layoutMode === '1' ? 'active' : ''}`}
            onClick={() => { setLayoutMode('1'); setActiveSlotId(1); }}
            title="단일 화면"
          >
            <Maximize size={16} /> 1화면
          </button>
          <button 
            className={`control-btn ${layoutMode === '2' ? 'active' : ''}`}
            onClick={() => { setLayoutMode('2'); if (activeSlotId > 2) setActiveSlotId(1); }}
            title="2분할 화면"
          >
            <LayoutGrid size={16} style={{ transform: 'rotate(90deg)' }} /> 2분할
          </button>
          <button 
            className={`control-btn ${layoutMode === '4' ? 'active' : ''}`}
            onClick={() => setLayoutMode('4')}
            title="4분할 화면"
          >
            <Grid2X2 size={16} /> 4분할
          </button>
        </div>

        {/* 실시간 갱신 상태 뱃지 */}
        <div className="live-status-container">
          <span className="live-blink-dot"></span>
          <span className="live-status-text">LIVE 갱신 중 (15초 주기)</span>
          {lastRefreshed && (
            <span className="last-refresh-time">최근 갱신: {lastRefreshed}</span>
          )}
        </div>
      </div>

      {/* 대시보드 메인 레이아웃 */}
      <main className="dashboard-layout">
        
        {/* 왼쪽 영역: 멀티 차트 그리드 */}
        <div className={`charts-grid mode-${layoutMode}`}>
          {visibleSlots.map((slot) => {
            const isActive = slot.id === activeSlotId;
            return (
              <div 
                key={slot.id} 
                className={`chart-slot-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSlotId(slot.id)}
              >
                {/* 차트 상단바 (각 차트마다 종목명 및 인터벌 개별 제어) */}
                <div className="slot-header">
                  <div className="slot-info">
                    <span className="slot-number-badge">차트 {slot.id}</span>
                    <span className="slot-symbol-text">{slot.symbol}</span>
                    <span className="slot-name-text">{slot.name.split(',')[0]}</span>
                  </div>
                  
                  {/* 주기(Interval) 선택 바 */}
                  <div className="interval-selector">
                    {['1m', '5m', '15m', '1h', '2h', '4h', '1d', '1wk', '1mo'].map((int) => (
                      <button
                        key={int}
                        className={`interval-btn ${slot.interval === int ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIntervalChange(slot.id, int);
                        }}
                      >
                        {int}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 차트 영역 및 에러/로딩 제어 */}
                <div className="slot-chart-area">
                  {slot.loading && (
                    <div className="slot-overlay loading">
                      <Loader2 className="animate-spin text-cyan" size={32} />
                      <span>실시간 데이터 불러오는 중...</span>
                    </div>
                  )}
                  {slot.error && (
                    <div className="slot-overlay error">
                      <AlertCircle className="text-red" size={32} />
                      <p>{slot.error}</p>
                      <button 
                        className="retry-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadSlotData(slot.id, slot.symbol, slot.interval);
                        }}
                      >
                        다시 시도
                      </button>
                    </div>
                  )}
                  {!slot.loading && !slot.error && slot.data.length > 0 && (
                    <ErrorBoundary>
                      <StockChart
                        data={slot.data}
                        showFibonacci={slot.showFibonacci}
                        showChannel={slot.showChannel}
                        fibLookback={slot.fibLookback}
                        channelLookback={slot.channelLookback}
                      />
                    </ErrorBoundary>
                  )}
                  {!slot.loading && !slot.error && slot.data.length === 0 && (
                    <div className="slot-overlay">데이터가 없습니다.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 오른쪽 영역: 활성화된 슬롯의 지표 설정 패널 */}
        <div className="dashboard-sidebar">
          <IndicatorPanel
            showFibonacci={activeSlot.showFibonacci}
            setShowFibonacci={(val) => updateActiveSlotSettings({ showFibonacci: val })}
            showChannel={activeSlot.showChannel}
            setShowChannel={(val) => updateActiveSlotSettings({ showChannel: val })}
            fibLookback={activeSlot.fibLookback}
            setFibLookback={(val) => updateActiveSlotSettings({ fibLookback: val })}
            channelLookback={activeSlot.channelLookback}
            setChannelLookback={(val) => updateActiveSlotSettings({ channelLookback: val })}
          />
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-neon-blue)', marginBottom: '0.5rem' }}>ℹ️ 멀티 차트 가이드</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              차트 영역을 클릭하면 **초록색 네온 테두리**가 활성화됩니다. 테두리가 켜진 차트를 선택한 후 검색바에서 종목을 변경하거나 우측 패널에서 피보나치 및 빗각 채널 설정을 변경하면 해당 차트에만 독립적으로 적용됩니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
