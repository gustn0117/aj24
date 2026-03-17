export default function Footer() {
  return (
    <footer className="bg-[#2b2d36] text-gray-400">
      {/* Main footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="AJ24" className="h-7 w-auto brightness-0 invert" />
              <span className="text-white font-black text-lg tracking-tight">AJ24</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-5 max-w-xs">
              트렌디한 패션 아이템부터 데일리 베이직까지.
              당신의 스타일을 완성하는 모든 것.
            </p>
            <div className="flex items-center gap-2.5">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#9ca3af">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#9ca3af">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#9ca3af">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">고객센터</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/mypage" className="hover:text-white transition-colors">마이페이지</a></li>
              <li><a href="/mypage/orders" className="hover:text-white transition-colors">주문 조회</a></li>
              <li><a href="/mypage/wishlist" className="hover:text-white transition-colors">위시리스트</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">이용 안내</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/terms" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-white/10 pt-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">결제수단</span>
              {["VISA", "MC", "KAKAO", "NAVER", "TOSS"].map((m) => (
                <div key={m} className="h-7 px-3 bg-white/5 rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-500 tracking-wider">{m}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                SSL 보안결제
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                정품 보증
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <span>&copy; 2026 AJ24. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/terms" className="hover:text-gray-300 transition-colors">이용약관</a>
            <span className="w-px h-3 bg-white/10" />
            <a href="/privacy" className="hover:text-gray-300 transition-colors font-semibold">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
