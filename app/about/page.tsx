"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Target, Eye, Heart, Users, Lightbulb, Globe } from "lucide-react"
import { aboutImages, getGalleryImages } from "@/lib/images"

export default function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const galleryImages = getGalleryImages()

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
      <section className="bg-gradient-to-br from-purple-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-purple-600">WIE ISIMM</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover our journey, mission, and commitment to empowering women in engineering
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                To facilitate the recruitment and retention of women in engineering programs and careers. We strive to
                promote the professional development of women in engineering through networking, mentoring, and career
                guidance while fostering an inclusive environment that celebrates diversity.
              </p>
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To create a world where women engineers are equally represented, valued, and empowered to make
                significant contributions to technology and society. We envision a future where gender equality in
                engineering is not just an aspiration, but a reality.
              </p>
            </div>
            <div className="animate-on-scroll">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-200 rounded-3xl transform -rotate-6"></div>
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
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
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-on-scroll"
              >
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                  <value.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey in Pictures</h2>
            <p className="text-xl text-gray-600">Moments that define our community and achievements</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg animate-on-scroll">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="font-semibold">{image.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Be part of a supportive network of women engineers who are making a difference. Together, we can break
              barriers and create opportunities for the next generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Get Involved
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
