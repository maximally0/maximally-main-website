
import { useEffect } from "react";
import Footer from "@/components/Footer";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-black">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-press-start text-2xl sm:text-3xl mb-4 text-maximally-red">
          PRIVACY POLICY
        </h1>
        <p className="font-jetbrains text-sm text-gray-400 mb-8">
          Last updated: 14-11-2025
        </p>
        
        <div className="font-jetbrains space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              1. Introduction
            </h2>
            <p className="leading-relaxed text-white">
              We at Maximally recognise the importance of your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, process, disclose and protect your personal data when you visit maximally.in (the "Website") and use our Services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              2. Scope
            </h2>
            <p className="leading-relaxed text-white">
              This policy applies to all users of the Website and to all personal data collected or processed by us in connection with your use of the Website or Services.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              3. Definitions
            </h2>
            <ul className="space-y-2 leading-relaxed text-white">
              <li>"Personal Data" means any information relating to an identified or identifiable individual.</li>
              <li>"Sensitive Personal Data or Information (SPDI)" is as defined under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
              <li>"We", "us", "our" means Maximally.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              4. Information We Collect
            </h2>
            <p className="leading-relaxed mb-2 text-white">
              We may collect the following types of Personal Data:
            </p>
            <ul className="space-y-2 leading-relaxed list-disc list-inside text-white">
              <li>Name, email address, phone number.</li>
              <li>Billing / payment information if you purchase from us.</li>
              <li>Usage data: IP address, browser type/tab, pages visited, time and date of access, referring website.</li>
              <li>Cookies and tracking technologies (see clause 8).</li>
              <li>Any other information you provide voluntarily (e.g., via forms, feedback, enquiries).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              5. How We Use Your Information
            </h2>
            <p className="leading-relaxed mb-2 text-white">
              We use Personal Data for the following purposes:
            </p>
            <ul className="space-y-2 leading-relaxed list-disc list-inside text-white">
              <li>To provide, operate, maintain and improve the Website and Services.</li>
              <li>To process your orders, payments, fulfilment.</li>
              <li>To respond to your enquiries or customer service requests.</li>
              <li>To send you marketing communications (if you have opted in).</li>
              <li>To monitor usage, analyse trends and to protect against fraud or misuse.</li>
              <li>To comply with applicable legal obligations.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              6. Legal Basis (for EU/Global Users)
            </h2>
            <p className="leading-relaxed text-white">
              If you are located in a jurisdiction where legal bases apply (e.g., GDPR), the legal basis for processing is your consent, performance of a contract, legal obligation, our legitimate interests (provided they do not override your rights) or other lawful basis.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              7. Disclosure of Your Information
            </h2>
            <p className="leading-relaxed mb-2 text-white">
              We may disclose your Personal Data:
            </p>
            <ul className="space-y-2 leading-relaxed list-disc list-inside text-white">
              <li>To our service providers, contractors and agents who perform services on our behalf.</li>
              <li>To our affiliates or business partners in connection with the Services.</li>
              <li>If required by law, regulation or court order.</li>
              <li>To protect our rights, property or safety or those of users or others.</li>
              <li>In connection with a merger, sale or reorganisation of our business.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              8. Cookies & Tracking Technologies
            </h2>
            <p className="leading-relaxed text-white">
              We use cookies and similar tracking technologies to collect usage data. You can disable cookies via your browser settings, but note that disabling may affect Website functionality.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              9. Data Security
            </h2>
            <p className="leading-relaxed text-white">
              We implement reasonable technical and organisational measures to protect the Personal Data we collect and process. However, no system is entirely secure and we cannot guarantee absolute security of data transmitted to our Website.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              10. Data Retention
            </h2>
            <p className="leading-relaxed text-white">
              We will retain your Personal Data for as long as required to fulfil the purposes described in this policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              11. Your Rights
            </h2>
            <p className="leading-relaxed mb-2 text-white">
              Depending on your jurisdiction you may have rights including:
            </p>
            <ul className="space-y-2 leading-relaxed list-disc list-inside text-white">
              <li>Access your Personal Data.</li>
              <li>Correct inaccurate or incomplete Personal Data.</li>
              <li>Delete your Personal Data (right to be forgotten).</li>
              <li>Restrict or object to our processing of your Personal Data.</li>
              <li>Withdraw consent (if processing is based on consent).</li>
            </ul>
            <p className="leading-relaxed mt-2 text-white">
              If you wish to exercise any of these rights please contact us (see Clause 16).
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              12. Children's Information
            </h2>
            <p className="leading-relaxed text-white">
              Our Website is not intended for children under 13 years of age. We do not knowingly collect Personal Data from children. If you believe we have inadvertently collected data from a child, please contact us and we will delete it.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              13. International Transfers
            </h2>
            <p className="leading-relaxed text-white">
              If you are accessing our Website from outside India, your Personal Data may be transferred to, stored and processed in India or other jurisdictions where our service providers operate. By using the Website you consent to such transfers.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              14. Links to Other Websites
            </h2>
            <p className="leading-relaxed text-white">
              Our Website may contain links to other websites not operated by us. We are not responsible for the privacy practices of those websites.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              15. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed text-white">
              We may update this Privacy Policy from time to time. We will post the revised version on the Website and update "Last updated" date. Your continued use of the Website after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 16 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              16. Contact Us
            </h2>
            <p className="leading-relaxed text-white">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <p className="leading-relaxed mt-2 text-white">
              Email: <a href="mailto:support@maximally.in" className="text-maximally-red hover:underline">support@maximally.in</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
