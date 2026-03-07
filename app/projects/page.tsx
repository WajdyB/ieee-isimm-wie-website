"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface Project {
  _id: string
  title: string
  description: string
  technologies: string[]
  link: string
  picture?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        if (data.success) {
          setProjects(data.data || [])
        }
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d15]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-300">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#1a1625] via-[#0f111a] to-[#0a0d15] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Projects</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Discover impactful initiatives developed by WIE ISIMM, from digital platforms to community-focused innovations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#0a0d15] via-[#101526] to-[#141b2e]">
        <div className="container mx-auto px-4">
          {projects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#2f3b54] rounded-xl bg-[#121724]/60">
              <p className="text-gray-300 text-lg">No projects published yet.</p>
              <p className="text-gray-400 text-sm mt-2">Projects added by the admin dashboard will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
              {projects.map((project) => (
                <Card
                  key={project._id}
                  className="bg-[#121724]/95 border-[#2e3954] text-white hover:border-primary/60 transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  {project.picture ? (
                    <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={project.picture}
                        alt={`${project.title} preview`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl text-white">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-7">
                    <p className="text-gray-300 leading-relaxed text-[1.02rem]">{project.description}</p>

                    <div className="space-y-2">
                      <p className="text-sm uppercase tracking-wide text-gray-400">Technologies</p>
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies || []).map((tech) => (
                          <Badge key={`${project._id}-${tech}`} variant="secondary" className="bg-[#22283a] text-gray-100 border border-[#36435f]">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-base transition-colors"
                    >
                      Visit Project <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
