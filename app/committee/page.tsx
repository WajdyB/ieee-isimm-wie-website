"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Mail, Linkedin } from "lucide-react"

interface ExcomMember {
  _id?: string
  name: string
  position: string
  image?: string
  facebook?: string
  email?: string
  linkedin?: string
  rank?: number | null
}

interface ExcomMandate {
  _id: string
  name: string
  startYear?: number | null
  endYear?: number | null
  isCurrent?: boolean
  members?: ExcomMember[]
}

export default function CommitteePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [mandates, setMandates] = useState<ExcomMandate[]>([])
  const [selectedMandateId, setSelectedMandateId] = useState<string>("")

  const selectedMandate = mandates.find((m) => m._id === selectedMandateId)
  const members = selectedMandate?.members ?? []

  const sortedMembers = [...members].sort(
    (a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER),
  )

  const chairMember =
    sortedMembers.find((member) => member.position.toLowerCase().includes("chair")) ?? sortedMembers[0]

  useEffect(() => {
    // Small delay to ensure the DOM has updated with new members
    const timeoutId = setTimeout(() => {
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
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observerRef.current?.disconnect()
    }
  }, [sortedMembers])

  useEffect(() => {
    const loadMandates = async () => {
      try {
        const response = await fetch("/api/excom/mandates")
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setMandates(data.data)
          const current =
            data.data.find((m: ExcomMandate) => m.isCurrent) ?? data.data[0] ?? null
          if (current) {
            setSelectedMandateId(current._id)
          }
        }
      } catch (error) {
        console.error("Failed to load executive committee mandates:", error)
      }
    }

    loadMandates()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Executive <span className="text-purple-600">Committee</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Meet the dedicated leaders driving our mission forward and making a difference in the engineering
              community
            </p>
          </div>
        </div>
      </section>

      {/* Committee Members */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {mandates.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {mandates.map((mandate) => (
                <button
                  key={mandate._id}
                  type="button"
                  onClick={() => setSelectedMandateId(mandate._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    selectedMandateId === mandate._id
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-purple-600 border-purple-200 hover:bg-purple-50"
                  }`}
                >
                  {mandate.name}
                  {mandate.isCurrent ? " (current)" : ""}
                </button>
              ))}
            </div>
          )}

          {selectedMandate && (
            <p className="text-center text-gray-500 mb-6">
              Showing team for mandate{" "}
              <span className="font-semibold text-purple-600">{selectedMandate.name}</span>
            </p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-on-scroll"
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={400}
                    className="w-full h-80 object-contain object-center group-hover:scale-105 transition-transform duration-300 p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                      <Link
                        href={member.facebook || "#"}
                        target="_blank"
                        className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                      >
                        <Facebook className="h-5 w-5 text-white" />
                      </Link>
                      <Link
                        href={`mailto:${member.email}`}
                        className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                      >
                        <Mail className="h-5 w-5 text-white" />
                      </Link>
                      <Link
                        href={member.linkedin || "#"}
                        target="_blank"
                        className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                      >
                        <Linkedin className="h-5 w-5 text-white" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                    <Link href={member.facebook || "#"} target="_blank">
                      {member.name}
                    </Link>
                  </h3>
                  <p className="text-purple-600 font-medium mb-4">{member.position}</p>
                  <div className="flex justify-center space-x-3">
                    <Link
                      href={member.facebook || "#"}
                      target="_blank"
                      className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                    >
                      <Facebook className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`mailto:${member.email}`}
                      className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                    >
                      <Mail className="h-5 w-5" />
                    </Link>
                    <Link
                      href={member.linkedin || "#"}
                      target="_blank"
                      className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Message */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Leadership Message</h2>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-lg text-gray-600 mb-6 leading-relaxed italic">
                "Our executive committee is committed to creating an inclusive environment where every woman in
                engineering can thrive. We believe that diversity drives innovation, and together we are building a
                stronger, more equitable future for all engineers."
              </p>
              <div className="flex items-center justify-center">
                {chairMember ? (
                  <>
                    <Image
                      src={chairMember.image || "/placeholder.svg"}
                      alt={chairMember.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{chairMember.name}</p>
                      <p className="text-purple-600">{chairMember.position}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">Executive Committee</p>
                    <p className="text-purple-600">WIE ISIMM</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to Get Involved?</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Join our team and help us make a difference in the engineering community. We're always looking for
              passionate individuals to contribute to our mission.
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
