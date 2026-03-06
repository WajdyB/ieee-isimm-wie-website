import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"

const COLLECTION_NAME = "excom_mandates"

interface CreateMemberBody {
  name: string
  position: string
  image?: string
  facebook?: string
  email?: string
  linkedin?: string
  rank?: number
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ mandateId: string }> },
) {
  const { mandateId } = await context.params

  if (!mandateId) {
    return NextResponse.json(
      { success: false, message: "Mandate ID is required" },
      { status: 400 },
    )
  }

  let mandateObjectId: ObjectId
  try {
    mandateObjectId = new ObjectId(mandateId)
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid mandate ID" },
      { status: 400 },
    )
  }

  try {
    const body = (await req.json()) as CreateMemberBody
    const { name, position, image, facebook, email, linkedin, rank } = body

    if (!name || !position) {
      return NextResponse.json(
        { success: false, message: "Member name and position are required" },
        { status: 400 },
      )
    }

    const db = await getDb()
    const collection = db.collection(COLLECTION_NAME)

    const now = new Date()

    const member = {
      _id: new ObjectId(),
      name,
      position,
      image: image ?? "",
      facebook: facebook ?? "",
      email: email ?? "",
      linkedin: linkedin ?? "",
      rank: typeof rank === "number" ? rank : null,
      created_at: now,
      updated_at: now,
    }

    const result = await collection.updateOne(
      { _id: mandateObjectId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {
        $push: { members: member },
        $set: { updated_at: now },
      } as any,
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Mandate not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: member }, { status: 201 })
  } catch (error) {
    console.error("Error adding excom member:", error)
    return NextResponse.json(
      { success: false, message: "Failed to add executive committee member" },
      { status: 500 },
    )
  }
}
