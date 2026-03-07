import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const messages = await db
      .collection("messages")
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json()

    if (!email || !message) {
      return NextResponse.json(
        { success: false, message: "Email and message are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    const newMessage = {
      email,
      message,
      read: false,
      createdAt: new Date(),
    }

    const result = await db.collection("messages").insertOne(newMessage)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newMessage },
    })
  } catch (error) {
    console.error("Error saving message:", error)
    return NextResponse.json(
      { success: false, message: "Failed to save message" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, read } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Message ID is required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    const result = await db.collection("messages").updateOne(
      { _id: new ObjectId(id) },
      { $set: { read: read ?? true } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update message" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Message ID is required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection("messages").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete message" },
      { status: 500 }
    )
  }
}
