
import { useEffect } from "react";
import Footer from "@/components/Footer";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-black">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-press-start text-2xl sm:text-3xl mb-4 text-maximally-red">
          TERMS & CONDITIONS
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
              Welcome to maximally.in (the "Website"). These Terms & Conditions ("Terms") govern your access to and use of the Website, operated by Maximally ("we", "us", "our"). By accessing or using the Website, you agree to be bound by these Terms. If you do not agree, please do not use the Website.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              2. Definitions
            </h2>
            <ul className="space-y-2 leading-relaxed text-white">
              <li>"User", "you", "your" refers to any person accessing or using the Website.</li>
              <li>"Content" means text, images, graphics, videos, audio, data, and other materials available on the Website.</li>
              <li>"Services" means any products or services offered via the Website.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              3. Use of the Website
            </h2>
            <ul className="space-y-2 leading-relaxed list-disc list-inside text-white">
              <li>You agree to use the Website only for lawful purposes.</li>
              <li>You must not use the Website in any way that may harm, disable or impair it.</li>
              <li>You agree not to use the Website for any unauthorised or illegal purpose.</li>
              <li>You must not attempt to access any services, accounts or systems not intended for you.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              4. Intellectual Property
            </h2>
            <p className="leading-relaxed mb-2 text-white">
              All Content on the Website, including trademarks, service marks, logos, text, graphics and images, is owned or licensed by us and is protected by intellectual property laws.
            </p>
            <p className="leading-relaxed text-white">
              You may view, download or print pages for your personal, non-commercial use only. Any other use (including reproduction, modification, distribution, creating derivative works) requires our prior written permission.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              5. User Accounts
            </h2>
            <p className="leading-relaxed mb-2 text-white">If you create an account on the Website:</p>
            <ul className="space-y-2 leading-relaxed list-disc list-inside text-white">
              <li>You are responsible for keeping your account credentials secure.</li>
              <li>You are responsible for all activity under your account.</li>
              <li>We reserve the right to suspend or terminate your account if we believe you have violated these Terms.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              6. Orders, Payment & Delivery
            </h2>
            <ul className="space-y-2 leading-relaxed list-disc list-inside text-white">
              <li>All orders placed via the Website are subject to acceptance by us. We may refuse or cancel an order at our discretion.</li>
              <li>Prices and availability of Services are subject to change without notice.</li>
              <li>Payment must be completed through the methods provided.</li>
              <li>Delivery / fulfilment of Services will be as described on the Website and may be subject to additional terms.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              7. Refunds / Returns / Cancellations
            </h2>
            <p className="leading-relaxed mb-2 text-white">
              Our refund, returns and cancellation policies are as set out on the Website.
            </p>
            <p className="leading-relaxed text-white">
              We recommend you review such policies carefully before placing an order.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              8. Disclaimer of Warranties
            </h2>
            <p className="leading-relaxed mb-2 text-white">
              The Website and Services are provided "as is", without warranties or representations of any kind, express or implied.
            </p>
            <p className="leading-relaxed text-white">
              We do not guarantee that the Website will be error-free, uninterrupted, secure or free from viruses or other harmful components.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              9. Limitation of Liability
            </h2>
            <p className="leading-relaxed mb-2 text-white">
              To the maximum extent permitted by law, we and our directors, employees, agents are not liable for any indirect, incidental, consequential, special or exemplary damages arising out of or in connection with your use of the Website or Services.
            </p>
            <p className="leading-relaxed text-white">
              Our total liability to you for any claim arising under these Terms is limited to the amount paid by you (if any) for the Services giving rise to the claim.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              10. Indemnification
            </h2>
            <p className="leading-relaxed text-white">
              You agree to indemnify, defend and hold harmless Maximally and its affiliates, officers, directors, employees, agents from any claims, damages, losses, liabilities, and expenses arising out of your breach of these Terms or your use of the Website.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              11. Links to Third-Party Sites
            </h2>
            <p className="leading-relaxed text-white">
              The Website may contain links to other websites over which we have no control. We are not responsible for the content or practices of those third parties. Inclusion of any link does not imply endorsement.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              12. Privacy
            </h2>
            <p className="leading-relaxed text-white">
              Your use of the Website is also governed by our Privacy Policy. By using the Website you consent to such policy.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              13. Modification of Terms
            </h2>
            <p className="leading-relaxed text-white">
              We reserve the right to modify these Terms at any time. We will post the updated version on the Website and update the "Last updated" date. Your continued use of the Website after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              14. Governing Law & Jurisdiction
            </h2>
            <p className="leading-relaxed text-white">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Punjab, India.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="font-press-start text-lg mb-3 text-maximally-red">
              15. Contact Us
            </h2>
            <p className="leading-relaxed text-white">
              If you have questions about these Terms, please contact us at:
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

export default Terms;
