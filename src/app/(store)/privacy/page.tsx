import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-8">개인정보처리방침</h1>

        <div className="prose prose-sm prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-black mb-3">1. 개인정보의 수집 및 이용 목적</h2>
            <p>AJ24(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>회원 가입 및 관리: 회원 식별, 본인 확인, 서비스 부정이용 방지</li>
              <li>서비스 제공: 상품 배송, 결제, 환불 처리</li>
              <li>마케팅 활용: 신규 서비스 안내, 이벤트 정보 제공 (선택 동의 시)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">2. 수집하는 개인정보 항목</h2>
            <p>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>필수항목: 이름, 이메일, 비밀번호, 연락처</li>
              <li>선택항목: 주소, 생년월일</li>
              <li>자동수집: 접속 IP, 쿠키, 접속 로그</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">3. 개인정보의 보유 및 이용 기간</h2>
            <p>회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>회원 정보: 회원 탈퇴 시까지</li>
              <li>거래 기록: 전자상거래법에 따라 5년 보관</li>
              <li>접속 로그: 통신비밀보호법에 따라 3개월 보관</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">4. 개인정보의 제3자 제공</h2>
            <p>회사는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우는 예외로 합니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>회원이 사전에 동의한 경우</li>
              <li>법령에 의해 요구되는 경우</li>
              <li>배송 업무를 위해 배송업체에 필요 최소한의 정보 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">5. 개인정보의 안전성 확보 조치</h2>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>비밀번호 암호화 저장</li>
              <li>SSL 보안 프로토콜 적용</li>
              <li>개인정보 접근 권한 제한</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">6. 이용자의 권리</h2>
            <p>회원은 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보의 삭제를 요청할 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">7. 쿠키의 사용</h2>
            <p>회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">8. 개인정보 보호책임자</h2>
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <p className="font-semibold text-gray-900">개인정보 보호책임자</p>
              <p className="mt-1">이메일: privacy@aj24.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">9. 개인정보처리방침 변경</h2>
            <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 시행일 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
            <p className="mt-3 text-gray-400">시행일: 2026년 3월 1일</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
