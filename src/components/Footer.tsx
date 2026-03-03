export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full border-2 border-gray-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
              <span className="text-white font-bold text-lg">
                <span className="text-gray-500">온</span>오프마켓
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              최고의 제품을 최저가로 만나보세요.
              <br />
              온오프마켓에서 특별한 쇼핑을 경험하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">고객센터</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-white transition-colors">1:1 문의</a></li>
              <li><a href="#" className="hover:text-white transition-colors">배송 안내</a></li>
              <li><a href="#" className="hover:text-white transition-colors">반품/교환</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">회사 정보</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">회사 소개</a></li>
              <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-white transition-colors">제휴/입점 문의</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">연락처</h4>
            <ul className="space-y-2 text-sm">
              <li>전화: 1588-0000</li>
              <li>이메일: help@onoffmarket.com</li>
              <li>운영시간: 평일 09:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; 2026 온오프마켓. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
