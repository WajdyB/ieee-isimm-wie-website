import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/IEEEWIEISIMMSA",
      icon: Facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/ieee_wie_isimm_sag/?hl=fr",
      icon: Instagram,
      color: "hover:text-pink-600",
    },
    {
      name: "Email",
      href: "mailto:contact@wie-isimm.org",
      icon: Mail,
      color: "hover:text-primary",
    },
  ]

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Executive Committee", href: "/committee" },
    { name: "Events", href: "/events" },
  ]

  return (
    <footer className="bg-[#0d1117] border-t border-[#1f2937]/60 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Link href="/" aria-label="Go to homepage">
                <Logo type="wie" className="h-12 w-auto" />
              </Link>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Women in Engineering Affinity Group of IEEE ISIMM Student Branch. Empowering women in engineering 
              through professional development, networking, and mentorship opportunities.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-colors duration-200 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <p>IEEE ISIMM Student Branch</p>
              <p>Monastir, Tunisia</p>
              <p>
                <Link
                  href="mailto:contact@wie-isimm.org"
                  className="hover:text-primary transition-colors duration-200"
                >
                  contact@wie-isimm.org
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} WIE ISIMM. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm mr-2">Powered by</span>
              <div className="flex items-center">
                <Link
                  href="https://isimm.ieee.tn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit IEEE ISIMM Student Branch website"
                >
                  <Logo type="ieee" className="h-6 w-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 