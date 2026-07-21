import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { searchYahooStocks, type SearchResult } from '../../utils/api';

interface SearchBarProps {
  onSelectStock: (stock: SearchResult) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 최근 검색어 로드
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches_real');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // 기본 추천 리스트 (인기 미국 주식/ETF 및 한국 주식)
      const defaultRecommend: SearchResult[] = [
        { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'EQUITY', exchange: 'NASDAQ' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'EQUITY', exchange: 'NASDAQ' },
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', exchange: 'NYSEArca' },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', exchange: 'NASDAQ' },
        { symbol: '005930.KS', name: 'Samsung Electronics Co., Ltd.', type: 'EQUITY', exchange: 'Korea' }
      ];
      setRecentSearches(defaultRecommend);
    }
  }, []);

  // 외부 클릭 시 결과 창 닫기
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // 디바운스 기능이 적용된 실시간 주식 및 ETF 검색
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await searchYahooStocks(query);
        setResults(res);
      } catch (e) {
        console.error("Search fetch failed:", e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // 검색 항목 선택 시 처리
  const handleSelect = (stock: SearchResult) => {
    onSelectStock(stock);
    setIsOpen(false);
    setQuery('');

    // 최근 검색어 목록 업데이트 (중복 제거)
    const updated = [stock, ...recentSearches.filter(item => item.symbol !== stock.symbol)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches_real', JSON.stringify(updated));
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'ETF':
        return '#00d2d3'; // 네온 사이언
      case 'EQUITY':
        return '#10ac84'; // 네온 민트
      case 'INDEX':
        return '#ff9f43'; // 오렌지
      default:
        return '#94a3b8';
    }
  };

  return (
    <div ref={containerRef} className="search-bar-container">
      <div className={`search-input-wrapper ${isOpen ? 'active' : ''}`}>
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="실시간 주식/ETF 검색 (예: Apple, QQQ, 삼성전자, 000660)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {loading && <Loader2 className="search-icon animate-spin" size={16} />}
        {query && !loading && (
          <button className="clear-button" onClick={() => setQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="search-dropdown-menu">
          {query.trim().length === 0 ? (
            // 추천 및 최근 검색어 목록
            <div className="dropdown-section">
              <span className="section-title">최근 & 추천 주식 / ETF</span>
              <div className="chips-container">
                {recentSearches.map((stock) => (
                  <button
                    key={stock.symbol}
                    className="chip-item"
                    onClick={() => handleSelect(stock)}
                  >
                    {stock.symbol} ({stock.name.split(',')[0].slice(0, 10)})
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // 실시간 검색 결과 리스트
            <div className="dropdown-section">
              <span className="section-title">검색 결과 ({results.length})</span>
              {results.length > 0 ? (
                <div className="results-list">
                  {results.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="result-item"
                      onClick={() => handleSelect(stock)}
                    >
                      <div className="stock-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="stock-symbol">{stock.symbol}</span>
                          <span 
                            style={{ 
                              fontSize: '0.65rem', 
                              padding: '0.1rem 0.3rem', 
                              borderRadius: '4px',
                              background: 'rgba(255,255,255,0.05)',
                              color: getBadgeColor(stock.type),
                              border: `1px solid ${getBadgeColor(stock.type)}33`,
                              fontWeight: 'bold'
                            }}
                          >
                            {stock.type}
                          </span>
                        </div>
                        <span className="stock-name">{stock.name}</span>
                      </div>
                      <div className="stock-metrics" style={{ alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {stock.exchange}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && <div className="no-results">검색 결과가 없습니다.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
