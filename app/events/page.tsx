"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Calendar, MapPin, Users, X, ChevronLeft, ChevronRight, Loader2, Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Event {
  _id: string
  eventType?: "upcoming" | "previous"
  title: string
  description: string
  date: string
  location: string
  attendees: number
  registrationLink?: string
  picture?: string
  images: string[]
  created_at: string
  updated_at: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/events')
        const data = await response.json()

        if (data.success) {
          setEvents(data.data || [])
        } else {
          console.error('Failed to load events:', data.message)
          setEvents([])
        }
      } catch (error) {
        console.error('Error loading events:', error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const openLightbox = (event: Event) => {
    setSelectedEvent(event)
    setCurrentImageIndex(0)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedEvent(null)
    setCurrentImageIndex(0)
    document.body.style.overflow = "unset"
  }

  const nextImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setCurrentImageIndex((prev) => (prev === selectedEvent.images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedEvent.images.length - 1 : prev - 1))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const upcomingEvents = events
    .filter((event) => event.eventType === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastEvents = events
    .filter((event) => (event.eventType || "previous") !== "upcoming")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/events?t=' + Date.now())
      const data = await response.json()
      if (data.success) {
        setEvents(data.data || [])
      }
    } catch (error) {
      console.error('Error refreshing events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d15]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-300">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#1a1625] via-[#0f111a] to-[#0a0d15] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-primary">Events</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore what is coming next and revisit our previous events and achievements.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0d15]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Events Overview</h2>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              size="sm"
            >
              Refresh Events
            </Button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Events Found</h3>
                <p className="text-gray-300 mb-4">
                  There are currently no events scheduled. Check back soon for upcoming events!
                </p>
                <p className="text-sm text-gray-400">
                  Events will appear here once they are added through the admin panel.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-14">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-3xl font-bold text-white">Upcoming Events</h3>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                    {upcomingEvents.length}
                  </span>
                </div>

                {upcomingEvents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#2b344d] bg-[#121724]/70 p-8 text-gray-300">
                    No upcoming events for now.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event._id}
                        className="bg-[#121724] rounded-xl shadow-lg overflow-hidden border border-[#2b344d] hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="relative h-52 w-full overflow-hidden">
                          <Image
                            src={event.picture || event.images?.[0] || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6 space-y-4">
                          <h4 className="text-xl font-semibold text-white">{event.title}</h4>
                          <p className="text-gray-300 line-clamp-3">{event.description}</p>
                          <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-primary" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-primary" />
                              {event.location}
                            </div>
                          </div>
                          {event.registrationLink ? (
                            <a
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-colors"
                            >
                              Register Now <ArrowUpRight className="h-4 w-4" />
                            </a>
                          ) : (
                            <p className="text-sm text-gray-400">Registration link coming soon.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-3xl font-bold text-white">Past Events</h3>
                  <span className="px-3 py-1 rounded-full bg-secondary text-gray-200 text-sm font-medium">
                    {pastEvents.length}
                  </span>
                </div>

                {pastEvents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#2b344d] bg-[#121724]/70 p-8 text-gray-300">
                    No past events have been published yet.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-card rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-border"
                    onClick={() => openLightbox(event)}
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={event.images && event.images.length > 0 ? event.images[0] : "/placeholder.svg"}
                        alt={event.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-primary">
                          {event.images ? event.images.length : 0} photos
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors duration-200">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          {event.attendees} attendees
                        </div>
                      </div>
                    </div>
                  </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[#0a0d15]/95 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-xl overflow-hidden flex flex-col border border-border">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-secondary/80 backdrop-blur-sm p-2 rounded-full hover:bg-secondary transition-colors duration-200"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {selectedEvent.images && selectedEvent.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-secondary/80 backdrop-blur-sm p-2 rounded-full hover:bg-secondary transition-colors duration-200"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-secondary/80 backdrop-blur-sm p-2 rounded-full hover:bg-secondary transition-colors duration-200"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            <div className="relative h-96 flex-shrink-0">
              <Image
                src={selectedEvent.images && selectedEvent.images.length > 0 ? selectedEvent.images[currentImageIndex] : "/placeholder.svg"}
                alt={selectedEvent.title}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-3">{selectedEvent.title}</h2>
                <p className="text-gray-300 mb-4 leading-relaxed">{selectedEvent.description}</p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {formatDate(selectedEvent.date)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {selectedEvent.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    {selectedEvent.attendees} attendees
                  </div>
                </div>

                {selectedEvent.images && selectedEvent.images.length > 1 && (
                  <div className="mt-6">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {selectedEvent.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                            index === currentImageIndex ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${selectedEvent.title} ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-20 bg-gradient-to-br from-[#1e1b2e] via-[#2a1f3d] to-[#1e1b2e] text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Check our Socials</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Stay connected with us! Follow our journey, get the latest updates, and join our community on social media.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="https://www.facebook.com/IEEEWIEISIMMSA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/40 min-w-[200px]"
              >
                <Facebook className="h-6 w-6" />
                <span className="font-semibold">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/ieee_wie_isimm_sag/?hl=fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/40 min-w-[200px]"
              >
                <Instagram className="h-6 w-6" />
                <span className="font-semibold">Instagram</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/wie-isimm-1b9209386/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/40 min-w-[200px]"
              >
                <Linkedin className="h-6 w-6" />
                <span className="font-semibold">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
