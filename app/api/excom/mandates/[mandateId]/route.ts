import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"

const COLLECTION_NAME = "excom_mandates"

interface UpdateMandateBody {
  name?: string
  startYear?: number | null
  endYear?: number | null
  isCurrent?: boolean
}

export async function PATCH(
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
    const body = (await req.json()) as UpdateMandateBody
    const db = await getDb()
    const collection = db.collection(COLLECTION_NAME)

    const now = new Date()

    const updateFields: Record<string, unknown> = {}

    if (typeof body.name === "string") {
      updateFields.name = body.name
    }
    if (body.startYear !== undefined) {
      updateFields.startYear = body.startYear
    }
    if (body.endYear !== undefined) {
      updateFields.endYear = body.endYear
    }

    // Handle current mandate flag
    if (typeof body.isCurrent === "boolean") {
      if (body.isCurrent) {
        await collection.updateMany(
          { isCurrent: true },
          {
            $set: {
              isCurrent: false,
              updated_at: now,
            },
          },
        )
      }
      updateFields.isCurrent = body.isCurrent
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields provided to update" },
        { status: 400 },
      )
    }

    const result = await collection.findOneAndUpdate(
      { _id: mandateObjectId },
      {
        $set: {
          ...updateFields,
          updated_at: now,
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Mandate not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating excom mandate:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update executive committee mandate" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _req: NextRequest,
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
    const db = await getDb()
    const collection = db.collection(COLLECTION_NAME)

    const result = await collection.deleteOne({ _id: mandateObjectId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Mandate not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting excom mandate:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete executive committee mandate" },
      { status: 500 },
    )
  }
}
