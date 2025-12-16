import { useEffect } from "react";
import { Shield } from "lucide-react";
import Footer from "@/components/Footer";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      
      <div className="pt-24 px-4 pb-12 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-purple-300">LEGAL</span>
          </div>
          
          <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              PRIVACY POLICY
            </span>
          </h1>
          <p className="font-jetbrains text-sm text-gray-500 mb-8">
            Last updated: 14-11-2025
          </p>
          
          <div className="font-jetbrains space-y-8">
            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">1. Introduction</h2>
              <p className="leading-relaxed text-gray-300">
                We at Maximally recognise the importance of your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, process, disclose and protect your personal data when you visit maximally.in (the "Website") and use our Services.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">2. Scope</h2>
              <p className="leading-relaxed text-gray-300">
                This policy applies to all users of the Website and to all personal data collected or processed by us in connection with your use of the Website or Services.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">3. Definitions</h2>
              <ul className="space-y-2 leading-relaxed text-gray-300">
                <li>"Personal Data" means any information relating to an identified or identifiable individual.</li>
                <li>"Sensitive Personal Data or Information (SPDI)" is as defined under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
                <li>"We", "us", "our" means Maximally.</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">4. Information We Collect</h2>
              <p className="leading-relaxed mb-2 text-gray-300">We may collect the following types of Personal Data:</p>
              <ul className="space-y-2 leading-relaxed list-disc list-inside text-gray-300">
                <li>Name, email address, phone number.</li>
                <li>Billing / payment information if you purchase from us.</li>
                <li>Usage data: IP address, browser type/tab, pages visited, time and date of access, referring website.</li>
                <li>Cookies and tracking technologies (see clause 8).</li>
                <li>Any other information you provide voluntarily (e.g., via forms, feedback, enquiries).</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">5. How We Use Your Information</h2>
              <p className="leading-relaxed mb-2 text-gray-300">We use Personal Data for the following purposes:</p>
              <ul className="space-y-2 leading-relaxed list-disc list-inside text-gray-300">
                <li>To provide, operate, maintain and improve the Website and Services.</li>
                <li>To process your orders, payments, fulfilment.</li>
                <li>To respond to your enquiries or customer service requests.</li>
                <li>To send you marketing communications (if you have opted in).</li>
                <li>To monitor usage, analyse trends and to protect against fraud or misuse.</li>
                <li>To comply with applicable legal obligations.</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">6. Legal Basis (for EU/Global Users)</h2>
              <p className="leading-relaxed text-gray-300">
                If you are located in a jurisdiction where legal bases apply (e.g., GDPR), the legal basis for processing is your consent, performance of a contract, legal obligation, our legitimate interests (provided they do not override your rights) or other lawful basis.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">7. Disclosure of Your Information</h2>
              <p className="leading-relaxed mb-2 text-gray-300">We may disclose your Personal Data:</p>
              <ul className="space-y-2 leading-relaxed list-disc list-inside text-gray-300">
                <li>To our service providers, contractors and agents who perform services on our behalf.</li>
                <li>To our affiliates or business partners in connection with the Services.</li>
                <li>If required by law, regulation or court order.</li>
                <li>To protect our rights, property or safety or those of users or others.</li>
                <li>In connection with a merger, sale or reorganisation of our business.</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">8. Cookies & Tracking Technologies</h2>
              <p className="leading-relaxed text-gray-300">
                We use cookies and similar tracking technologies to collect usage data. You can disable cookies via your browser settings, but note that disabling may affect Website functionality.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">9. Data Security</h2>
              <p className="leading-relaxed text-gray-300">
                We implement reasonable technical and organisational measures to protect the Personal Data we collect and process. However, no system is entirely secure and we cannot guarantee absolute security of data transmitted to our Website.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">10. Data Retention</h2>
              <p className="leading-relaxed text-gray-300">
                We will retain your Personal Data for as long as required to fulfil the purposes described in this policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">11. Your Rights</h2>
              <p className="leading-relaxed mb-2 text-gray-300">Depending on your jurisdiction you may have rights including:</p>
              <ul className="space-y-2 leading-relaxed list-disc list-inside text-gray-300">
                <li>Access your Personal Data.</li>
                <li>Correct inaccurate or incomplete Personal Data.</li>
                <li>Delete your Personal Data (right to be forgotten).</li>
                <li>Restrict or object to our processing of your Personal Data.</li>
                <li>Withdraw consent (if processing is based on consent).</li>
              </ul>
              <p className="leading-relaxed mt-2 text-gray-300">
                If you wish to exercise any of these rights please contact us (see Clause 16).
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">12. Children's Information</h2>
              <p className="leading-relaxed text-gray-300">
                Our Website is not intended for children under 13 years of age. We do not knowingly collect Personal Data from children. If you believe we have inadvertently collected data from a child, please contact us and we will delete it.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">13. International Transfers</h2>
              <p className="leading-relaxed text-gray-300">
                If you are accessing our Website from outside India, your Personal Data may be transferred to, stored and processed in India or other jurisdictions where our service providers operate. By using the Website you consent to such transfers.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">14. Links to Other Websites</h2>
              <p className="leading-relaxed text-gray-300">
                Our Website may contain links to other websites not operated by us. We are not responsible for the privacy practices of those websites.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">15. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed text-gray-300">
                We may update this Privacy Policy from time to time. We will post the revised version on the Website and update "Last updated" date. Your continued use of the Website after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">16. Contact Us</h2>
              <p className="leading-relaxed text-gray-300">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <p className="leading-relaxed mt-2 text-gray-300">
                Email: <a href="mailto:support@maximally.in" className="text-purple-400 hover:text-purple-300 transition-colors">support@maximally.in</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
