import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import { type StockItem, searchStocks, mockStocks } from '../../utils/mockData';

interface SearchBarProps {
  onSelectStock: (stock: StockItem) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<StockItem[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 최근 검색어 초기 로드 (로컬 스토리지 활용)
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // 초기에는 인기 주식 몇 개를 배치
      setRecentSearches(mockStocks.slice(0, 3));
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

  // 검색 쿼리 변경 대응
  useEffect(() => {
    const filtered = searchStocks(query);
    setResults(filtered);
  }, [query]);

  // 검색 항목 선택 시 처리
  const handleSelect = (stock: StockItem) => {
    onSelectStock(stock);
    setIsOpen(false);
    setQuery('');

    // 최근 검색어 추가 (중복 제거)
    const updated = [stock, ...recentSearches.filter(item => item.symbol !== stock.symbol)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  return (
    <div ref={containerRef} className="search-bar-container">
      <div className={`search-input-wrapper ${isOpen ? 'active' : ''}`}>
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="주식명 또는 티커 검색 (예: 테슬라, AAPL, 삼성전자)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button className="clear-button" onClick={() => setQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="search-dropdown-menu">
          {query.trim().length === 0 ? (
            // 최근 검색어 및 추천 목록
            <div className="dropdown-section">
              <span className="section-title">최근 & 인기 검색어</span>
              <div className="chips-container">
                {recentSearches.map((stock) => (
                  <button
                    key={stock.symbol}
                    className="chip-item"
                    onClick={() => handleSelect(stock)}
                  >
                    {stock.nameKo}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // 검색 결과 리스트
            <div className="dropdown-section">
              <span className="section-title">검색 결과 ({results.length})</span>
              {results.length > 0 ? (
                <div className="results-list">
                  {results.map((stock) => {
                    const isPositive = stock.changeRate >= 0;
                    return (
                      <div
                        key={stock.symbol}
                        className="result-item"
                        onClick={() => handleSelect(stock)}
                      >
                        <div className="stock-info">
                          <span className="stock-symbol">{stock.symbol}</span>
                          <span className="stock-name">{stock.nameKo} ({stock.nameEn})</span>
                        </div>
                        <div className="stock-metrics">
                          <span className="stock-price">
                            {stock.symbol.includes('005930') || stock.symbol.includes('000660') 
                              ? `${stock.price.toLocaleString()}원`
                              : `$${stock.price.toFixed(2)}`}
                          </span>
                          <span className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isPositive ? `+${stock.changeRate}%` : `${stock.changeRate}%`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-results">검색 결과가 존재하지 않습니다.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
