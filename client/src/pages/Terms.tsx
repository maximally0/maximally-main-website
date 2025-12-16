import { useEffect } from "react";
import { ScrollText } from "lucide-react";
import Footer from "@/components/Footer";

const Terms = () => {
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
            <ScrollText className="w-4 h-4 text-purple-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-purple-300">LEGAL</span>
          </div>
          
          <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              TERMS & CONDITIONS
            </span>
          </h1>
          <p className="font-jetbrains text-sm text-gray-500 mb-8">
            Last updated: 14-11-2025
          </p>
          
          <div className="font-jetbrains space-y-8">
            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">1. Introduction</h2>
              <p className="leading-relaxed text-gray-300">
                Welcome to maximally.in (the "Website"). These Terms & Conditions ("Terms") govern your access to and use of the Website, operated by Maximally ("we", "us", "our"). By accessing or using the Website, you agree to be bound by these Terms. If you do not agree, please do not use the Website.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">2. Definitions</h2>
              <ul className="space-y-2 leading-relaxed text-gray-300">
                <li>"User", "you", "your" refers to any person accessing or using the Website.</li>
                <li>"Content" means text, images, graphics, videos, audio, data, and other materials available on the Website.</li>
                <li>"Services" means any products or services offered via the Website.</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">3. Use of the Website</h2>
              <ul className="space-y-2 leading-relaxed list-disc list-inside text-gray-300">
                <li>You agree to use the Website only for lawful purposes.</li>
                <li>You must not use the Website in any way that may harm, disable or impair it.</li>
                <li>You agree not to use the Website for any unauthorised or illegal purpose.</li>
                <li>You must not attempt to access any services, accounts or systems not intended for you.</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">4. Intellectual Property</h2>
              <p className="leading-relaxed mb-2 text-gray-300">
                All Content on the Website, including trademarks, service marks, logos, text, graphics and images, is owned or licensed by us and is protected by intellectual property laws.
              </p>
              <p className="leading-relaxed text-gray-300">
                You may view, download or print pages for your personal, non-commercial use only. Any other use (including reproduction, modification, distribution, creating derivative works) requires our prior written permission.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">5. User Accounts</h2>
              <p className="leading-relaxed mb-2 text-gray-300">If you create an account on the Website:</p>
              <ul className="space-y-2 leading-relaxed list-disc list-inside text-gray-300">
                <li>You are responsible for keeping your account credentials secure.</li>
                <li>You are responsible for all activity under your account.</li>
                <li>We reserve the right to suspend or terminate your account if we believe you have violated these Terms.</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">6. Orders, Payment & Delivery</h2>
              <ul className="space-y-2 leading-relaxed list-disc list-inside text-gray-300">
                <li>All orders placed via the Website are subject to acceptance by us. We may refuse or cancel an order at our discretion.</li>
                <li>Prices and availability of Services are subject to change without notice.</li>
                <li>Payment must be completed through the methods provided.</li>
                <li>Delivery / fulfilment of Services will be as described on the Website and may be subject to additional terms.</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">7. Refunds / Returns / Cancellations</h2>
              <p className="leading-relaxed mb-2 text-gray-300">
                Our refund, returns and cancellation policies are as set out on the Website.
              </p>
              <p className="leading-relaxed text-gray-300">
                We recommend you review such policies carefully before placing an order.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">8. Disclaimer of Warranties</h2>
              <p className="leading-relaxed mb-2 text-gray-300">
                The Website and Services are provided "as is", without warranties or representations of any kind, express or implied.
              </p>
              <p className="leading-relaxed text-gray-300">
                We do not guarantee that the Website will be error-free, uninterrupted, secure or free from viruses or other harmful components.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">9. Limitation of Liability</h2>
              <p className="leading-relaxed mb-2 text-gray-300">
                To the maximum extent permitted by law, we and our directors, employees, agents are not liable for any indirect, incidental, consequential, special or exemplary damages arising out of or in connection with your use of the Website or Services.
              </p>
              <p className="leading-relaxed text-gray-300">
                Our total liability to you for any claim arising under these Terms is limited to the amount paid by you (if any) for the Services giving rise to the claim.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">10. Indemnification</h2>
              <p className="leading-relaxed text-gray-300">
                You agree to indemnify, defend and hold harmless Maximally and its affiliates, officers, directors, employees, agents from any claims, damages, losses, liabilities, and expenses arising out of your breach of these Terms or your use of the Website.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">11. Links to Third-Party Sites</h2>
              <p className="leading-relaxed text-gray-300">
                The Website may contain links to other websites over which we have no control. We are not responsible for the content or practices of those third parties. Inclusion of any link does not imply endorsement.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">12. Privacy</h2>
              <p className="leading-relaxed text-gray-300">
                Your use of the Website is also governed by our Privacy Policy. By using the Website you consent to such policy.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">13. Modification of Terms</h2>
              <p className="leading-relaxed text-gray-300">
                We reserve the right to modify these Terms at any time. We will post the updated version on the Website and update the "Last updated" date. Your continued use of the Website after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">14. Governing Law & Jurisdiction</h2>
              <p className="leading-relaxed text-gray-300">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Punjab, India.
              </p>
            </section>

            <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 p-6">
              <h2 className="font-press-start text-sm mb-3 text-purple-300">15. Contact Us</h2>
              <p className="leading-relaxed text-gray-300">
                If you have questions about these Terms, please contact us at:
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

export default Terms;
