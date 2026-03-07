"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  attendees: number
  images: string[]
  created_at: string
  updated_at: string
}

export default function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

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

  // Load recent events from database
  useEffect(() => {
    const loadRecentEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/events')
        const data = await response.json()
        
        if (data.success && data.data) {
          const recent = data.data.slice(0, 3)
          setRecentEvents(recent)
        }
      } catch (error) {
        console.error('Error loading recent events:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadRecentEvents()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a1625] via-[#0f111a] to-[#0a0d15] py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Empowering <span className="text-primary">Women</span> in Engineering
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Welcome to the Women in Engineering Affinity Group of IEEE ISIMM Student Branch. We are dedicated to
                inspiring, engaging, encouraging, and empowering women in engineering and technology fields through
                professional development, networking, and mentorship opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/about">
                    Learn More <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/events">View Events</Link>
                </Button>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="relative">
                <div className="absolute -inset-3 bg-[#c4b5fd]/55 rounded-3xl transform rotate-6"></div>
                <div className="absolute -inset-1 bg-[#e2e8f0]/70 rounded-3xl transform -rotate-3"></div>
                <Image
                  src="/images/home/hero-image.png"
                  alt="WIE ISIMM Members"
                  width={600}
                  height={500}
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Preview */}
      <section className="py-20 bg-gradient-to-br from-[#1e1b2e] via-[#2a1f3d] to-[#1e1b2e] text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              To facilitate the recruitment and retention of women in engineering programs and careers, and to promote
              the professional development of women in engineering through networking, mentoring, and career guidance.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/about">
                Discover Our Story <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Events Preview */}
      <section className="py-20 bg-[#0f111a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Recent Events</h2>
            <p className="text-xl text-gray-300">Stay updated with our latest activities and achievements</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            {loading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full max-w-sm bg-card rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="h-8 bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              ))
            ) : recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <div
                  key={event._id ?? `${event.title}-${index}`}
                  className="w-full max-w-sm bg-card rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 animate-on-scroll border border-border"
                  style={{ 
                    display: 'block', 
                    visibility: 'visible', 
                    opacity: 1,
                    position: 'relative'
                  }}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.images[0] || '/images/placeholder.jpg'}
                      alt={event.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-300 mb-2 text-sm">
                      {formatDate(event.date)} • {event.location}
                    </p>
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              // No events state
              <div className="w-full text-center py-12">
                <p className="text-gray-400 text-lg">No recent events found</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
