import { Emblem } from "../Component/HomePage/Emblem";

const coverageLinks = ["Politics & Elections", "Tamil Nadu News", "National Affairs", "World", "Sports", "Technology", "Business & Economy"];
const companyLinks = ["About Us", "Editorial Team", "Contact", "Advertise with Us", "Careers", "Corrections Policy", "e-Paper"];
const editionLinks = ["Chennai Edition", "Coimbatore Edition", "Madurai Edition", "Salem Edition", "Trichy Edition"];
const legalLinks = ["Privacy Policy", "Terms of Use", "Cookie Settings"];

export function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-[#d0d0d0] pt-12 pb-6 mt-10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-5 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[280px_1fr_1fr_1fr] gap-10 pb-8 border-b border-[#2a2a2a] mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <Emblem size={36} className="w-[36px] h-[36px]" />
              <div className="font-display text-[16px] font-black text-mv-red">மாண்புமிகு வேட்பாளர்</div>
            </div>
            <p className="text-[12px] leading-relaxed text-[#888] font-serif">Tamil Nadu&apos;s most trusted independent news platform - delivering credible, fearless journalism since 2020.</p>
            <p className="text-[11px] text-[#555] mt-2 italic">&quot;When the Society Rise.. The King Rises.&quot;</p>
            <div className="flex gap-2 mt-4">
              {["FB", "X", "YT", "IG", "WA"].map((icon) => (
                <div key={icon} className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center text-[11px] font-bold cursor-pointer transition-colors border border-[#2a2a2a] hover:bg-mv-red hover:border-mv-red hover:text-white">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white mb-3.5 pb-2 border-b border-[#2a2a2a]">Coverage</div>
            <ul className="list-none flex flex-col gap-2">
              {coverageLinks.map((link) => <li key={link}><a href="#" className="text-[13px] text-[#888] hover:text-mv-red transition-colors">{link}</a></li>)}
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white mb-3.5 pb-2 border-b border-[#2a2a2a]">Company</div>
            <ul className="list-none flex flex-col gap-2">
              {companyLinks.map((link) => <li key={link}><a href="#" className="text-[13px] text-[#888] hover:text-mv-red transition-colors">{link}</a></li>)}
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white mb-3.5 pb-2 border-b border-[#2a2a2a]">Editions</div>
            <ul className="list-none flex flex-col gap-2 mb-5">
              {editionLinks.map((link) => <li key={link}><a href="#" className="text-[13px] text-[#888] hover:text-mv-red transition-colors">{link}</a></li>)}
            </ul>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white mb-3.5 pb-2 border-b border-[#2a2a2a]">Legal</div>
            <ul className="list-none flex flex-col gap-2">
              {legalLinks.map((link) => <li key={link}><a href="#" className="text-[13px] text-[#888] hover:text-mv-red transition-colors">{link}</a></li>)}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-[11.5px] text-[#555] gap-2 md:gap-4">
          <span>© 2026 Maanbumigu Vetpaalar Media Pvt. Ltd. All rights reserved.</span>
          <span>Registered in Tamil Nadu, India | <a href="#" className="text-[#555] hover:text-mv-red transition-colors">RNI: TNBIL/2020/84230</a></span>
          <span>Made with ❤ in Chennai</span>
        </div>
      </div>
    </footer>
  );
}
