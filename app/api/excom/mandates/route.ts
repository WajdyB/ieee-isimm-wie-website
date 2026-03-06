import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"

const COLLECTION_NAME = "excom_mandates"

interface CreateMandateBody {
  name: string
  startYear?: number
  endYear?: number
  isCurrent?: boolean
}

export async function GET() {
  try {
    const db = await getDb()
    const mandates = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ startYear: -1, created_at: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: mandates })
  } catch (error) {
    console.error("Error fetching excom mandates:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch executive committee mandates" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateMandateBody
    const { name, startYear, endYear, isCurrent } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Mandate name is required" },
        { status: 400 },
      )
    }

    const db = await getDb()
    const collection = db.collection(COLLECTION_NAME)

    const now = new Date()

    // If this mandate is marked as current, unset isCurrent on all others
    if (isCurrent) {
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

    const mandateDoc = {
      name,
      startYear: startYear ?? null,
      endYear: endYear ?? null,
      isCurrent: Boolean(isCurrent),
      members: [] as unknown[],
      created_at: now,
      updated_at: now,
    }

    const result = await collection.insertOne(mandateDoc)

    const created = {
      ...mandateDoc,
      _id: result.insertedId,
    }

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    console.error("Error creating excom mandate:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create executive committee mandate" },
      { status: 500 },
    )
  }
}

