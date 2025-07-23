import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT update event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventData = await request.json()
    const eventId = params.id

    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.date || !eventData.location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const update = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      location: eventData.location,
      attendees: eventData.attendees || 0,
      images: eventData.images || [],
      updated_at: new Date()
    }
    const result = await db.collection('events').findOneAndUpdate(
      { _id: new ObjectId(eventId) },
      { $set: update },
      { returnDocument: 'after' }
    )
    if (!result.value) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ 
      success: true, 
      data: result.value,
      message: 'Event updated successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id
    const db = await getDb()
    const result = await db.collection('events').deleteOne({ _id: new ObjectId(eventId) })
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 