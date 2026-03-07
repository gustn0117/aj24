import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-8">이용약관</h1>

        <div className="prose prose-sm prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-black mb-3">제1조 (목적)</h2>
            <p>이 약관은 AJ24(이하 &quot;회사&quot;)가 운영하는 온라인 쇼핑몰에서 제공하는 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제2조 (정의)</h2>
            <p>&quot;서비스&quot;란 회사가 운영하는 쇼핑몰을 통해 제공하는 상품 판매 및 관련 부가서비스를 의미합니다.</p>
            <p>&quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 이용할 수 있는 자를 말합니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제3조 (약관의 효력 및 변경)</h2>
            <p>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</p>
            <p>회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 안에서 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 공지합니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제4조 (서비스의 제공)</h2>
            <p>회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>상품 정보 제공 및 구매 서비스</li>
              <li>배송 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제5조 (회원가입)</h2>
            <p>이용자는 회사가 정한 양식에 따라 회원정보를 기입한 후 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제6조 (회원 탈퇴 및 자격 제한)</h2>
            <p>회원은 언제든지 회사에 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제7조 (구매신청)</h2>
            <p>회원은 쇼핑몰에서 다음 방법에 의하여 구매를 신청합니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>상품 검색 및 선택</li>
              <li>수량 선택</li>
              <li>결제 방법 선택 및 결제</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제8조 (배송)</h2>
            <p>회사는 회원이 구매한 상품에 대해 배송수단, 배송비용 부담, 배송기간 등을 명시합니다. 일반적으로 주문일로부터 3~5 영업일 이내에 배송됩니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제9조 (환불 및 교환)</h2>
            <p>회원은 상품 수령 후 7일 이내에 교환 또는 환불을 요청할 수 있습니다. 단, 회원의 단순 변심에 의한 경우 반품 배송비는 회원이 부담합니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-black mb-3">제10조 (면책)</h2>
            <p>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
