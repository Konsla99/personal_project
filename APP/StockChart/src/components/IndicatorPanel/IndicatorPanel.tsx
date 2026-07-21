import React from 'react';
import { Eye, EyeOff, Sliders } from 'lucide-react';

interface IndicatorPanelProps {
  showFibonacci: boolean;
  setShowFibonacci: (val: boolean) => void;
  showChannel: boolean;
  setShowChannel: (val: boolean) => void;
  fibLookback: number;
  setFibLookback: (val: number) => void;
  channelLookback: number;
  setChannelLookback: (val: number) => void;
}

export const IndicatorPanel: React.FC<IndicatorPanelProps> = ({
  showFibonacci,
  setShowFibonacci,
  showChannel,
  setShowChannel,
  fibLookback,
  setFibLookback,
  channelLookback,
  setChannelLookback
}) => {
  return (
    <div className="indicator-panel-wrapper">
      <div className="panel-header">
        <Sliders className="header-icon" size={18} />
        <h3>자동 차트 분석 설정</h3>
      </div>

      <div className="panel-content">
        {/* 피보나치 되돌림 설정 */}
        <div className={`indicator-section ${showFibonacci ? 'active' : ''}`}>
          <div className="indicator-toggle-row">
            <div className="toggle-label-group">
              <span className="indicator-title">피보나치 되돌림</span>
              <span className="indicator-desc">최근 최고점/최저점 기준 자동 되돌림선 작도</span>
            </div>
            <button 
              className={`toggle-button ${showFibonacci ? 'enabled' : 'disabled'}`}
              onClick={() => setShowFibonacci(!showFibonacci)}
            >
              {showFibonacci ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          
          {showFibonacci && (
            <div className="control-slider-group">
              <div className="slider-label-row">
                <span>분석 기간 (캔들 개수)</span>
                <span className="slider-value">{fibLookback}일</span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                value={fibLookback}
                onChange={(e) => setFibLookback(Number(e.target.value))}
                className="neon-slider"
              />
            </div>
          )}
        </div>

        {/* 빗각 채널 설정 */}
        <div className={`indicator-section ${showChannel ? 'active' : ''}`}>
          <div className="indicator-toggle-row">
            <div className="toggle-label-group">
              <span className="indicator-title">빗각 채널 (Parallel Channel)</span>
              <span className="indicator-desc">선형 회귀 기반 추세선 및 평행 채널 작도</span>
            </div>
            <button 
              className={`toggle-button ${showChannel ? 'enabled' : 'disabled'}`}
              onClick={() => setShowChannel(!showChannel)}
            >
              {showChannel ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {showChannel && (
            <div className="control-slider-group">
              <div className="slider-label-row">
                <span>분석 기간 (캔들 개수)</span>
                <span className="slider-value">{channelLookback}일</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={channelLookback}
                onChange={(e) => setChannelLookback(Number(e.target.value))}
                className="neon-slider"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default IndicatorPanel;
