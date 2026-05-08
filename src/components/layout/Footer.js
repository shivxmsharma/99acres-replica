import Link from "next/link";
import { Globe } from "lucide-react";
import { FaFacebookF as Facebook, FaTwitter as Twitter, FaInstagram as Instagram, FaLinkedinIn as Linkedin, FaYoutube as Youtube } from "react-icons/fa";

const FOOTER_SECTIONS = [
  {
    title: "Real Estate in India",
    links: [
      { label: "Property in Delhi", href: "/search" },
      { label: "Property in Mumbai", href: "/search" },
      { label: "Property in Bangalore", href: "/search" },
      { label: "Property in Pune", href: "/search" },
      { label: "Property in Gurgaon", href: "/search" }
    ],
  },
  {
    title: "New Projects in India",
    links: [
      { label: "New Projects in Noida", href: "/search" },
      { label: "New Projects in Kolkata", href: "/search" },
      { label: "New Projects in Hyderabad", href: "/search" },
      { label: "New Projects in Ahmedabad", href: "/search" },
      { label: "New Projects in Chandigarh", href: "/search" }
    ],
  },
  {
    title: "Services",
    links: [
      { label: "EMI Calculator", href: "/tools/emi-calculator" },
      { label: "Stamp Duty Calculator", href: "/tools/stamp-duty" },
      { label: "Property Valuation", href: "/tools/valuation" },
      { label: "Compare Properties", href: "/compare" },
      { label: "Legal Services", href: "#" }
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Terms & Conditions", href: "#" },
      { label: "Privacy Policy", href: "#" }
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#091E42] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-blue-200">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black italic tracking-tighter">99acres</span>
              <span className="text-[10px] text-gray-500 uppercase">A 1:1 Replica Project</span>
            </div>
            <p className="text-[10px] text-gray-500 max-w-xs leading-relaxed">
              All rights reserved to 99acres.com. This is a technical demonstration project built to showcase UI/UX replication capabilities.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <Link key={i} href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <Icon size={18} />
              </Link>
            ))}
          </div>

          {/* Language / Region */}
          <button className="flex items-center gap-2 text-xs font-medium border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
            <Globe size={14} /> India | English
          </button>
        </div>

        <div className="mt-12 text-center text-[10px] text-gray-600">
          © 2026 NestIQ Technical Labs. No copyright infringement intended.
        </div>
      </div>
    </footer>
  );
}
