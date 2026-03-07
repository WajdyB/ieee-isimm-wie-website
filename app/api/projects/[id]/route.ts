import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

type Context = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: Context) {
  try {
    const params = "then" in context.params ? await context.params : context.params
    const projectId = params.id

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) })

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: project })
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

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const params = "then" in context.params ? await context.params : context.params
    const projectId = params.id

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      )
    }

    const payload = await request.json()
    const updates: {
      title?: string
      description?: string
      technologies?: string[]
      link?: string
      picture?: string
      updated_at: Date
    } = {
      updated_at: new Date(),
    }

    if (typeof payload.title === "string") updates.title = payload.title.trim()
    if (typeof payload.description === "string") updates.description = payload.description.trim()
    if (typeof payload.link === "string") updates.link = payload.link.trim()
    if (typeof payload.picture === "string") updates.picture = payload.picture.trim()
    if (Array.isArray(payload.technologies)) {
      updates.technologies = payload.technologies
        .map((tech: unknown) => String(tech).trim())
        .filter((tech: string) => tech.length > 0)
    }

    const db = await getDb()
    const result = await db
      .collection("projects")
      .findOneAndUpdate(
        { _id: new ObjectId(projectId) },
        { $set: updates },
        { returnDocument: "after" }
      )

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result, message: "Project updated successfully" })
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

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const params = "then" in context.params ? await context.params : context.params
    const projectId = params.id

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(projectId) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" })
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
