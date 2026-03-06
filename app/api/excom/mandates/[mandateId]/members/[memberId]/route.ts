import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"

const COLLECTION_NAME = "excom_mandates"

interface UpdateMemberBody {
  name?: string
  position?: string
  image?: string
  facebook?: string
  email?: string
  linkedin?: string
  rank?: number | null
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ mandateId: string; memberId: string }> },
) {
  const { mandateId, memberId } = await context.params

  if (!mandateId || !memberId) {
    return NextResponse.json(
      { success: false, message: "Mandate ID and member ID are required" },
      { status: 400 },
    )
  }

  let mandateObjectId: ObjectId
  let memberObjectId: ObjectId
  try {
    mandateObjectId = new ObjectId(mandateId)
    memberObjectId = new ObjectId(memberId)
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid mandate or member ID" },
      { status: 400 },
    )
  }

  try {
    const body = (await req.json()) as UpdateMemberBody
    const db = await getDb()
    const collection = db.collection(COLLECTION_NAME)

    const now = new Date()

    const updateFields: Record<string, unknown> = {}

    if (typeof body.name === "string") {
      updateFields["members.$.name"] = body.name
    }
    if (typeof body.position === "string") {
      updateFields["members.$.position"] = body.position
    }
    if (typeof body.image === "string") {
      updateFields["members.$.image"] = body.image
    }
    if (typeof body.facebook === "string") {
      updateFields["members.$.facebook"] = body.facebook
    }
    if (typeof body.email === "string") {
      updateFields["members.$.email"] = body.email
    }
    if (typeof body.linkedin === "string") {
      updateFields["members.$.linkedin"] = body.linkedin
    }
    if (body.rank !== undefined) {
      updateFields["members.$.rank"] = body.rank
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields provided to update" },
        { status: 400 },
      )
    }

    updateFields["members.$.updated_at"] = now

    const result = await collection.findOneAndUpdate(
      {
        _id: mandateObjectId,
        "members._id": memberObjectId,
      },
      {
        $set: updateFields,
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Mandate or member not found" },
        { status: 404 },
      )
    }

    const updatedMember = (result.members ?? []).find((m: any) => String(m._id) === String(memberObjectId))

    return NextResponse.json({ success: true, data: updatedMember ?? null })
  } catch (error) {
    console.error("Error updating excom member:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update executive committee member" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ mandateId: string; memberId: string }> },
) {
  const { mandateId, memberId } = await context.params

  if (!mandateId || !memberId) {
    return NextResponse.json(
      { success: false, message: "Mandate ID and member ID are required" },
      { status: 400 },
    )
  }

  let mandateObjectId: ObjectId
  let memberObjectId: ObjectId
  try {
    mandateObjectId = new ObjectId(mandateId)
    memberObjectId = new ObjectId(memberId)
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid mandate or member ID" },
      { status: 400 },
    )
  }

  try {
    const db = await getDb()
    const collection = db.collection(COLLECTION_NAME)

    const now = new Date()

    const result = await collection.updateOne(
      { _id: mandateObjectId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {
        $pull: { members: { _id: memberObjectId } },
        $set: { updated_at: now },
      } as any,
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Mandate not found" },
        { status: 404 },
      )
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting excom member:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete executive committee member" },
      { status: 500 },
    )
  }
}

