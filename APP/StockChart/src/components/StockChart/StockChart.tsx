import React, { useEffect, useRef, useState } from 'react';
import { createChart, type IChartApi, type ISeriesApi, CandlestickSeries } from 'lightweight-charts';
import { 
  calculateFibonacci, 
  calculateTrendChannel, 
  type BarData, 
  type FibonacciLevels, 
  type TrendChannel 
} from '../../utils/math';

interface StockChartProps {
  data: BarData[];
  showFibonacci: boolean;
  showChannel: boolean;
  fibLookback: number;
  channelLookback: number;
}

export const StockChart: React.FC<StockChartProps> = ({
  data,
  showFibonacci,
  showChannel,
  fibLookback,
  channelLookback
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [fibLevels, setFibLevels] = useState<FibonacciLevels | null>(null);
  const [trendChannel, setTrendChannel] = useState<TrendChannel | null>(null);

  // 1. 피보나치 및 채널 지표 계산
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    if (showFibonacci) {
      const fib = calculateFibonacci(data, fibLookback);
      setFibLevels(fib);
    } else {
      setFibLevels(null);
    }

    if (showChannel) {
      const channel = calculateTrendChannel(data, channelLookback);
      setTrendChannel(channel);
    } else {
      setTrendChannel(null);
    }
  }, [data, showFibonacci, showChannel, fibLookback, channelLookback]);

  // 2. 오버레이 캔버스 그리기 함수
  const drawOverlay = () => {
    const canvas = canvasRef.current;
    const chart = chartRef.current;
    const series = seriesRef.current;

    if (!canvas || !chart || !series || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기를 컨테이너 크기에 동기화
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // 기존 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const timeScale = chart.timeScale();

    // 2.1 빗각 채널 작도
    if (showChannel && trendChannel) {
      const { slope, upperIntercept, lowerIntercept, intercept, startIndex, endIndex } = trendChannel;

      // 분석 범위 시작/종료 봉 정보
      const startBar = data[startIndex];
      const endBar = data[endIndex];

      if (startBar && endBar) {
        // 시간 좌표(X) 변환
        const startX = timeScale.timeToCoordinate(startBar.time as any);
        const endX = timeScale.timeToCoordinate(endBar.time as any);

        if (startX !== null && endX !== null) {
          // 인덱스 간격
          const totalSteps = endIndex - startIndex;

          // 시작점 및 끝점 가격 계산
          // y = mx + c (x는 subset의 상대인덱스이므로 시작은 0, 끝은 totalSteps)
          const startCenterPrice = intercept;
          const endCenterPrice = slope * totalSteps + intercept;

          const startUpperPrice = upperIntercept;
          const endUpperPrice = slope * totalSteps + upperIntercept;

          const startLowerPrice = lowerIntercept;
          const endLowerPrice = slope * totalSteps + lowerIntercept;

          // Y 좌표 변환
          const startCenterY = series.priceToCoordinate(startCenterPrice);
          const endCenterY = series.priceToCoordinate(endCenterPrice);

          const startUpperY = series.priceToCoordinate(startUpperPrice);
          const endUpperY = series.priceToCoordinate(endUpperPrice);

          const startLowerY = series.priceToCoordinate(startLowerPrice);
          const endLowerY = series.priceToCoordinate(endLowerPrice);

          if (
            startCenterY !== null && endCenterY !== null &&
            startUpperY !== null && endUpperY !== null &&
            startLowerY !== null && endLowerY !== null
          ) {
            // 채널 배경 칠하기 (은은한 글래스 네온 블루)
            ctx.beginPath();
            ctx.moveTo(startX, startUpperY);
            ctx.lineTo(endX, endUpperY);
            ctx.lineTo(endX, endLowerY);
            ctx.lineTo(startX, startLowerY);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
            gradient.addColorStop(0, 'rgba(0, 210, 211, 0.05)');
            gradient.addColorStop(1, 'rgba(84, 160, 255, 0.05)');
            ctx.fillStyle = gradient;
            ctx.fill();

            // 상단선 그리기 (네온 민트)
            ctx.beginPath();
            ctx.moveTo(startX, startUpperY);
            ctx.lineTo(endX, endUpperY);
            ctx.strokeStyle = '#10ac84';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#10ac84';
            ctx.stroke();

            // 하단선 그리기 (네온 레드/핑크)
            ctx.beginPath();
            ctx.moveTo(startX, startLowerY);
            ctx.lineTo(endX, endLowerY);
            ctx.strokeStyle = '#ff4a4a';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff4a4a';
            ctx.stroke();

            // 중심선 그리기 (점선, 네온 블루)
            ctx.beginPath();
            ctx.moveTo(startX, startCenterY);
            ctx.lineTo(endX, endCenterY);
            ctx.strokeStyle = '#54a0ff';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 6]);
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#54a0ff';
            ctx.stroke();
            
            ctx.setLineDash([]); // 대시 원상복구
            ctx.shadowBlur = 0; // 그림자 제거
          }
        }
      }
    }

    // 2.2 피보나치 되돌림 작도
    if (showFibonacci && fibLevels) {
      const activeLookback = Math.min(data.length, fibLookback);
      const startBar = data[data.length - activeLookback];
      const endBar = data[data.length - 1];

      if (startBar && endBar) {
        const startX = timeScale.timeToCoordinate(startBar.time as any);
        const endX = timeScale.timeToCoordinate(endBar.time as any);

        if (startX !== null && endX !== null) {
          // 각 피보나치 레벨별 수평선 그리기
          fibLevels.levels.forEach((level) => {
            const y = series.priceToCoordinate(level.price);
            if (y !== null) {
              // 피보나치 수평선
              ctx.beginPath();
              ctx.moveTo(startX, y);
              ctx.lineTo(canvas.width - 50, y); // 가격 라벨 표시 여백 남김
              ctx.strokeStyle = level.color;
              ctx.lineWidth = level.ratio === 0.5 || level.ratio === 0.618 ? 2 : 1;
              ctx.shadowBlur = level.ratio === 0.5 || level.ratio === 0.618 ? 6 : 0;
              ctx.shadowColor = level.color;
              ctx.stroke();
              ctx.shadowBlur = 0;

              // 비율 텍스트 표시
              ctx.fillStyle = level.color;
              ctx.font = '10px Roboto, sans-serif';
              ctx.textAlign = 'right';
              ctx.fillText(
                `${(level.ratio * 100).toFixed(1)}% (${level.price.toLocaleString(undefined, { maximumFractionDigits: 2 })})`,
                canvas.width - 10,
                y - 4
              );
            }
          });
        }
      }
    }
  };

  // 3. 차트 초기화 및 라이프사이클 관리
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // 차트 생성
    const chart = createChart(container, {
      layout: {
        background: { color: '#0d0e12' },
        textColor: '#9095a5',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.3)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.3)' },
      },
      crosshair: {
        mode: 1, // Normal crosshair
        vertLine: {
          color: '#54a0ff',
          labelBackgroundColor: '#54a0ff',
        },
        horzLine: {
          color: '#54a0ff',
          labelBackgroundColor: '#54a0ff',
        },
      },
      timeScale: {
        borderColor: '#2a2e39',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2a2e39',
      },
      width: container.clientWidth || 800,
      height: container.clientHeight || 450,
    });

    // 캔들스틱 시리즈 추가
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10ac84',
      downColor: '#ff4a4a',
      borderVisible: false,
      wickUpColor: '#10ac84',
      wickDownColor: '#ff4a4a',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // ResizeObserver를 통해 컨테이너 크기 변경 실시간 추적
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ 
        width: width || 800, 
        height: height || 450 
      });
      // 크기가 바뀐 후 약간의 지연을 두고 캔버스 오버레이 다시 그리기
      setTimeout(drawOverlay, 50);
    });

    resizeObserver.observe(container);

    // 스크롤 및 줌 발생 시 오버레이 실시간 갱신 이벤트 등록
    chart.timeScale().subscribeVisibleTimeRangeChange(() => {
      drawOverlay();
    });

    // 컴포넌트 언마운트 시 클린업
    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // 4. 데이터 변경 시 차트 데이터 업데이트 및 오버레이 재계산
  useEffect(() => {
    const series = seriesRef.current;
    if (series && data.length > 0) {
      series.setData(data as any);
      
      // 차트의 줌/스케일을 최근 데이터에 맞춤
      setTimeout(() => {
        chartRef.current?.timeScale().fitContent();
        drawOverlay();
      }, 100);
    }
  }, [data]);

  // 5. 지표 켜고 끄기 등 옵션이 바뀔 때 실시간으로 오버레이 재작도
  useEffect(() => {
    drawOverlay();
  }, [fibLevels, trendChannel, showFibonacci, showChannel]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
      {/* 1. 실제 차트가 렌더링되는 컨테이너 */}
      <div 
        ref={chartContainerRef} 
        style={{ width: '100%', height: '100%', minHeight: '400px' }} 
      />

      {/* 2. 피보나치와 빗각 채널을 얹을 투명 오버레이 캔버스 */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // 마우스 이벤트가 아래의 차트 컴포넌트로 전달되도록 설정
          zIndex: 10
        }}
      />
    </div>
  );
};
export default StockChart;
