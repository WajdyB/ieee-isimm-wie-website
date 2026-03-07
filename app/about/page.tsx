"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Target, Eye, Heart, Users, Lightbulb, Globe } from "lucide-react"
import { aboutImages, getGalleryImages } from "@/lib/images"
import NumberTicker from "@/components/ui/number-ticker"

export default function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const galleryImages = getGalleryImages()

  // Debug: Log the number of images loaded
  console.log('Gallery images loaded:', galleryImages.length)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1625] via-[#0f111a] to-[#0a0d15] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-primary">WIE ISIMM</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Discover our journey, mission, and commitment to empowering women in engineering
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#0a0d15]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                To facilitate the recruitment and retention of women in engineering programs and careers. We strive to
                promote the professional development of women in engineering through networking, mentoring, and career
                guidance while fostering an inclusive environment that celebrates diversity.
              </p>
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                To create a world where women engineers are equally represented, valued, and empowered to make
                significant contributions to technology and society. We envision a future where gender equality in
                engineering is not just an aspiration, but a reality.
              </p>
            </div>
            <div className="animate-on-scroll">
              <div className="relative">
                <div className="absolute -inset-3 bg-[#c4b5fd]/55 rounded-3xl transform -rotate-6"></div>
                <div className="absolute -inset-1 bg-[#e2e8f0]/70 rounded-3xl transform rotate-3"></div>
                <Image
                  src={aboutImages.mission.src}
                  alt={aboutImages.mission.alt}
                  width={aboutImages.mission.width}
                  height={aboutImages.mission.height}
                  className={aboutImages.mission.className}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#0f111a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-300">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Empowerment",
                description:
                  "We believe in empowering women to reach their full potential in engineering and technology fields.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "Building strong networks and supportive communities that foster collaboration and growth.",
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "Encouraging creative thinking and innovative solutions to engineering challenges.",
              },
              {
                icon: Globe,
                title: "Diversity",
                description: "Celebrating diversity and promoting inclusive practices in all our activities.",
              },
              {
                icon: Target,
                title: "Excellence",
                description:
                  "Striving for excellence in everything we do while maintaining high professional standards.",
              },
              {
                icon: Eye,
                title: "Leadership",
                description:
                  "Developing leadership skills and creating opportunities for women to lead in engineering.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-on-scroll border border-border"
              >
                <div className="bg-secondary/60 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary/80 transition-colors duration-300">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 bg-gradient-to-br from-[#2a1f3d] via-[#3d2858] to-[#2a1f3d] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-on-scroll">
            <div className="p-6">
              <div className="text-4xl md:text-6xl font-black mb-2 flex justify-center items-center">
                <span>+</span>
                <NumberTicker value={100} />
              </div>
              <p className="text-lg md:text-xl font-medium text-gray-200">Active Members</p>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-6xl font-black mb-2 flex justify-center items-center">
                <span>+</span>
                <NumberTicker value={40} delay={0.2} />
              </div>
              <p className="text-lg md:text-xl font-medium text-gray-200">Tech Workshops</p>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-6xl font-black mb-2 flex justify-center items-center">
                <span>+</span>
                <NumberTicker value={30} delay={0.4} />
              </div>
              <p className="text-lg md:text-xl font-medium text-gray-200">Talks & Seminars</p>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-6xl font-black mb-2 flex justify-center items-center">
                <NumberTicker value={1} delay={0.6} />
              </div>
              <p className="text-lg md:text-xl font-medium text-gray-200">Incredible Community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of WIE (3D Flip Cards) */}
      <section className="py-24 bg-[#0f111a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Pillars of WIE</h2>
            <p className="text-xl text-gray-300">The core foundations that build our community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto perspective-1000">
            {/* Flip Card 1 */}
            <div className="group h-96 [perspective:1000px] animate-on-scroll" style={{ transitionDelay: "0ms" }}>
              <div className="relative h-full w-full rounded-2xl shadow-xl transition-transform duration-500 ease-out transform-gpu will-change-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-card [backface-visibility:hidden] flex flex-col items-center justify-center p-8 border border-border">
                  <div className="bg-secondary/60 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <Heart className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Empowerment</h3>
                  <p className="text-gray-400 text-center">Fostering confidence and strength</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-[#3d2858] to-[#2a1f3d] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" alt="Empowerment" fill className="object-cover opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-[#1e1b2e]/90 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-4">Empowerment</h3>
                    <p className="text-gray-200 leading-relaxed">We nurture the next generation of female leaders by providing them with the confidence, resources, and platform to excel in their engineering careers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flip Card 2 */}
            <div className="group h-96 [perspective:1000px] animate-on-scroll" style={{ transitionDelay: "200ms" }}>
              <div className="relative h-full w-full rounded-2xl shadow-xl transition-transform duration-500 ease-out transform-gpu will-change-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-card [backface-visibility:hidden] flex flex-col items-center justify-center p-8 border border-border">
                  <div className="bg-secondary/60 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Networking</h3>
                  <p className="text-gray-400 text-center">Building lifelong connections</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-[#3d2858] to-[#2a1f3d] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Networking" fill className="object-cover opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-[#1e1b2e]/90 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-4">Networking</h3>
                    <p className="text-gray-200 leading-relaxed">Our community spans across the globe. We connect students with industry professionals, mentors, and peers who share the same passion for technology.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flip Card 3 */}
            <div className="group h-96 [perspective:1000px] animate-on-scroll" style={{ transitionDelay: "400ms" }}>
              <div className="relative h-full w-full rounded-2xl shadow-xl transition-transform duration-500 ease-out transform-gpu will-change-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-card [backface-visibility:hidden] flex flex-col items-center justify-center p-8 border border-border">
                  <div className="bg-secondary/60 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <Lightbulb className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Technical Excellence</h3>
                  <p className="text-gray-400 text-center">Mastering modern engineering</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-[#3d2858] to-[#2a1f3d] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&q=80" alt="Technical Excellence" fill className="object-cover opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-[#1e1b2e]/90 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-4">Technical Excellence</h3>
                    <p className="text-gray-200 leading-relaxed">From coding workshops and technical talks to practical project-building sessions, we provide hands-on experience that bridges the gap between theoretical study and real-world application.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Women Who Inspire Us (Interactive Hover Cards) */}
      <section className="py-24 bg-[#0a0d15]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Women Who Inspire Us</h2>
            <p className="text-xl text-gray-300">Celebrating the pioneers and leaders shaping the future of Science Technology Engineering Mathematics ( STEM ) .</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Card 1 */}
            <div className="group relative h-96 rounded-2xl overflow-hidden animate-on-scroll cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <Image 
                src="/images/about/ada-lovelace.jpg" 
                alt="Ada Lovelace" 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end h-full">
                <h3 className="text-white text-2xl font-bold mb-1">Ada Lovelace</h3>
                <p className="text-purple-300 font-medium mb-3">The First Computer Programmer</p>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                  "That brain of mine is something more than merely mortal; as time will show." Her notes on the Analytical Engine recognized that computers could do more than just pure mathematical calculations.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative h-96 rounded-2xl overflow-hidden animate-on-scroll cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500" style={{ transitionDelay: "100ms" }}>
              <Image 
                src="/images/about/Radia-Perlman.jpg" 
                alt="Radia Perlman" 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end h-full">
                <h3 className="text-white text-2xl font-bold mb-1">Radia Perlman</h3>
                <p className="text-purple-300 font-medium mb-3">Computer Scientist</p>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                  Radia Perlman has played a major role in driving the growth and development of the internet. Her best-known contribution is the Spanning Tree Protocol (STP), which transformed Ethernet from a technology limited to a few hundred nodes confined within a single building into a technology that can create large networks with hundreds of thousands of computers. She also made fundamental contributions to internet routing, making routing more resilient, scalable and easy to manage. The protocols she designed in the 1980s remain widely deployed today.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative h-96 rounded-2xl overflow-hidden animate-on-scroll cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500" style={{ transitionDelay: "200ms" }}>
              <Image 
                src="/images/about/katherine-johnson.jpg" 
                alt="Katherine Johnson" 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end h-full">
                <h3 className="text-white text-2xl font-bold mb-1">Katherine Johnson</h3>
                <p className="text-purple-300 font-medium mb-3">NASA Mathematician</p>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                  "We will always have STEM with us. Some things will drop out of the public eye and will go away, but there will always be science, engineering, and technology."
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative h-96 rounded-2xl overflow-hidden animate-on-scroll cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500" style={{ transitionDelay: "300ms" }}>
              <Image 
                src="/images/about/marie-curie.jpg" 
                alt="Marie Curie" 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end h-full">
                <h3 className="text-white text-2xl font-bold mb-1">Marie Curie</h3>
                <p className="text-purple-300 font-medium mb-3">Pioneer of radioactivity and first woman to win a Nobel Prize</p>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                  She discovered the elements Polonium and Radium and conducted groundbreaking research on radioactivity, winning two Nobel Prizes in physics and chemistry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover WIE World */}
      <section className="py-20 bg-gradient-to-br from-[#1e1b2e] via-[#2a1f3d] to-[#1e1b2e] text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover the WIE World</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              One global mission, countless stories of impact: IEEE WIE connects, inspires, and empowers women in
              engineering and technology across every stage of their journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wie.ieee.tn/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#8b5cf6] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Explore WIE Tunisia
              </a>
              <a
                href="https://wie.ieee.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                Visit IEEE WIE Global
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
