import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const projects = await db.collection("projects").find({}).sort({ created_at: -1 }).toArray()

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()

    if (!projectData.title || !projectData.description || !projectData.link) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    const technologies = Array.isArray(projectData.technologies)
      ? projectData.technologies
          .map((tech: unknown) => String(tech).trim())
          .filter((tech: string) => tech.length > 0)
      : []

    const project = {
      title: String(projectData.title).trim(),
      description: String(projectData.description).trim(),
      technologies,
      link: String(projectData.link).trim(),
      picture: typeof projectData.picture === "string" ? projectData.picture.trim() : "",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const db = await getDb()
    const result = await db.collection("projects").insertOne(project)

    return NextResponse.json({
      success: true,
      data: { ...project, _id: result.insertedId },
      message: "Project created successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
