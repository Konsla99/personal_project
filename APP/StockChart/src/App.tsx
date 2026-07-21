import React, { useState, useEffect } from 'react';
import { AreaChart, TrendingUp, TrendingDown } from 'lucide-react';
import { SearchBar } from './components/SearchBar/SearchBar';
import { StockChart } from './components/StockChart/StockChart';
import { IndicatorPanel } from './components/IndicatorPanel/IndicatorPanel';
import { type StockItem, mockStocks, generateMockChartData } from './utils/mockData';
import type { BarData } from './utils/math';

export const App: React.FC = () => {
  // 1. 상태 정의
  const [selectedStock, setSelectedStock] = useState<StockItem>(mockStocks[0]); // 기본 테슬라
  const [chartData, setChartData] = useState<BarData[]>([]);

  // 2. 지표 설정 상태 정의
  const [showFibonacci, setShowFibonacci] = useState<boolean>(true);
  const [fibLookback, setFibLookback] = useState<number>(55);
  const [showChannel, setShowChannel] = useState<boolean>(true);
  const [channelLookback, setChannelLookback] = useState<number>(40);

  // 3. 주식이 선택되었을 때 데이터 로드
  useEffect(() => {
    const data = generateMockChartData(selectedStock.symbol, 120);
    setChartData(data);
  }, [selectedStock]);

  const handleSelectStock = (stock: StockItem) => {
    setSelectedStock(stock);
  };

  const isPositive = selectedStock.changeRate >= 0;

  return (
    <div className="app-container">
      {/* 글로벌 헤더 영역 */}
      <header className="app-header">
        <div className="brand-section">
          <h1 className="brand-title">
            <AreaChart size={28} /> StockChart
          </h1>
          <span className="brand-subtitle">자동 차트 드로잉 분석 플랫폼 (피보나치 & 빗각 채널)</span>
        </div>
        <SearchBar onSelectStock={handleSelectStock} />
      </header>

      {/* 대시보드 레이아웃 */}
      <main className="dashboard-layout">
        {/* 왼쪽: 차트 및 주식 기본정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          
          {/* 주가 정보 요약 헤더바 */}
          <div className="stock-detail-bar">
            <div className="stock-main-info">
              <span className="detail-symbol">{selectedStock.symbol}</span>
              <h2 className="detail-name">{selectedStock.nameKo}</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {selectedStock.nameEn}
              </span>
            </div>
            
            <div className="stock-price-info">
              <span className="detail-price">
                {selectedStock.symbol.includes('005930') || selectedStock.symbol.includes('000660')
                  ? `${selectedStock.price.toLocaleString()}원`
                  : `$${selectedStock.price.toFixed(2)}`}
              </span>
              <span className={`detail-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {isPositive ? `+${selectedStock.changeRate}%` : `${selectedStock.changeRate}%`}
              </span>
            </div>
          </div>

          {/* 차트 뷰 */}
          <div className="chart-container-card">
            <StockChart
              data={chartData}
              showFibonacci={showFibonacci}
              showChannel={showChannel}
              fibLookback={fibLookback}
              channelLookback={channelLookback}
            />
          </div>
        </div>

        {/* 오른쪽: 자동 작도 설정 사이드바 */}
        <div style={{ width: '100%' }}>
          <IndicatorPanel
            showFibonacci={showFibonacci}
            setShowFibonacci={setShowFibonacci}
            showChannel={showChannel}
            setShowChannel={setShowChannel}
            fibLookback={fibLookback}
            setFibLookback={setFibLookback}
            channelLookback={channelLookback}
            setChannelLookback={setChannelLookback}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
