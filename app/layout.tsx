import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import HelpAssistant from "@/components/help-assistant"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WIE ISIMM - Women in Engineering",
  description: "IEEE ISIMM Student Branch - Women in Engineering Affinity Group",
  icons: {
    icon: "/favicon-wie.ico"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
        <ScrollToTop />
        <HelpAssistant />
      </body>
    </html>
  )
}
