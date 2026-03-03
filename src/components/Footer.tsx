export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Marquee strip */}
      <div className="border-b border-gray-800/50 py-4 marquee-strip">
        <div className="marquee-inner">
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j} className="flex items-center gap-8 px-4">
              {["FREE SHIPPING", "PREMIUM QUALITY", "EASY RETURNS", "NEW ARRIVALS", "BEST PRICE", "TRENDY FASHION", "FREE SHIPPING", "PREMIUM QUALITY", "EASY RETURNS", "NEW ARRIVALS"].map((text, i) => (
                <span key={i} className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] flex items-center gap-8">
                  {text}
                  <span className="w-1 h-1 bg-gray-700 rounded-full" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter section */}
      <div className="border-b border-gray-800/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                뉴스레터 구독
              </h3>
              <p className="text-sm text-gray-500">
                최신 할인 정보와 신상품 소식을 가장 먼저 받아보세요.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="이메일 주소 입력"
                className="flex-1 md:w-72 px-4 py-3 bg-gray-900 border border-gray-800 rounded-full text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
              />
              <button className="px-6 py-3 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-gray-100 transition-all active:scale-95 whitespace-nowrap">
                구독하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-5">
              <img src="/images/logo.png" alt="AJ24" className="h-6 w-auto brightness-0 invert" />
              <span className="text-white font-extrabold text-sm">AJ24</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-5">
              트렌디한 패션 아이템부터
              <br />
              데일리 베이직까지.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#9ca3af">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#9ca3af">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">고객센터</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-white transition-colors">1:1 문의</a></li>
              <li><a href="#" className="hover:text-white transition-colors">배송 안내</a></li>
              <li><a href="#" className="hover:text-white transition-colors">반품/교환</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">회사 정보</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">회사 소개</a></li>
              <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-white transition-colors">제휴/입점 문의</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">연락처</h4>
            <ul className="space-y-2.5 text-sm">
              <li>1588-0000</li>
              <li>help@aj24.co.kr</li>
              <li>평일 09:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>&copy; 2026 AJ24. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-400 transition-colors">이용약관</a>
            <a href="#" className="hover:text-gray-400 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-gray-400 transition-colors">사업자정보</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
