"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Trash2, Upload, Eye, EyeOff, Loader2, Edit } from "lucide-react"
import Image from "next/image"
import {
  loginAdmin,
  getEvents,
  createEvent,
  deleteEvent,
  uploadImages,
  getExcomMandates,
  createExcomMandate,
  addExcomMember,
  updateExcomMandate,
  deleteExcomMandate,
  updateExcomMember,
  deleteExcomMember,
  type EventData,
  type ExcomMandate,
  type ExcomMember,
  type ExcomMemberData,
} from "@/lib/api"

// Add local Event type for MongoDB
interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  attendees: number
  images: string[]
  created_at: string
  updated_at: string
}

interface ExcomMandateWithMembers extends ExcomMandate {
  members: ExcomMember[]
}

interface FeedbackDialogState {
  open: boolean
  title: string
  message: string
}

interface EditMandateState {
  open: boolean
  id: string | null
  name: string
  startYear?: number | null
  endYear?: number | null
  isCurrent: boolean
}

interface EditMemberState {
  open: boolean
  mandateId: string | null
  memberId: string | null
  name: string
  position: string
  image?: string
  facebook?: string
  email?: string
  linkedin?: string
  rank?: number | null
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<EventData>({
    title: "",
    description: "",
    date: "",
    location: "",
    attendees: 0,
    images: [],
  })

  const [excomMandates, setExcomMandates] = useState<ExcomMandateWithMembers[]>([])
  const [selectedMandateId, setSelectedMandateId] = useState<string>("")
  const [newMandate, setNewMandate] = useState<{
    name: string
    startYear?: number
    endYear?: number
    isCurrent: boolean
  }>({
    name: "",
    startYear: undefined,
    endYear: undefined,
    isCurrent: true,
  })

  const [newMember, setNewMember] = useState<ExcomMemberData>({
    name: "",
    position: "",
    image: "",
    facebook: "",
    email: "",
    linkedin: "",
    rank: undefined,
  })

  const [memberImageUploading, setMemberImageUploading] = useState(false)
  const [feedbackDialog, setFeedbackDialog] = useState<FeedbackDialogState>({
    open: false,
    title: "",
    message: "",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [mandateDeleteDialogOpen, setMandateDeleteDialogOpen] = useState(false)
  const [mandateToDelete, setMandateToDelete] = useState<string | null>(null)
  const [memberDeleteDialogOpen, setMemberDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<{ mandateId: string; memberId: string } | null>(null)

  const [editMandate, setEditMandate] = useState<EditMandateState>({
    open: false,
    id: null,
    name: "",
    startYear: undefined,
    endYear: undefined,
    isCurrent: false,
  })

  const [editMember, setEditMember] = useState<EditMemberState>({
    open: false,
    mandateId: null,
    memberId: null,
    name: "",
    position: "",
    image: "",
    facebook: "",
    email: "",
    linkedin: "",
    rank: undefined,
  })

  const showFeedback = (title: string, message: string) => {
    setFeedbackDialog({ open: true, title, message })
  }

  // Load events on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadEvents()
      loadExcomMandates()
    }
  }, [isAuthenticated])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await getEvents()
      if (response.success) {
        setEvents(response.data)
      } else {
        console.error('Failed to load events:', response.message)
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadExcomMandates = async () => {
    try {
      setLoading(true)
      const response = await getExcomMandates()
      if (response.success) {
        setExcomMandates(response.data)
        if (!selectedMandateId && response.data.length > 0) {
          const current =
            response.data.find((m: ExcomMandateWithMembers) => m.isCurrent) ??
            response.data[0]
          setSelectedMandateId(current._id)
        }
      } else {
        console.error("Failed to load executive committee mandates:", response.message)
      }
    } catch (error) {
      console.error("Error loading executive committee mandates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      showFeedback("Missing information", "Please enter both email and password.")
      return
    }

    try {
      setLoading(true)
      const response = await loginAdmin({ email, password })
      
      if (response.success) {
        setIsAuthenticated(true)
        setEmail("")
        setPassword("")
      } else {
        showFeedback("Login failed", response.message || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error('Login error:', error)
      showFeedback("Login failed", "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setEvents([])
    setExcomMandates([])
    setSelectedMandateId("")
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
      showFeedback("Missing information", "Please fill in all required event fields.")
      return
    }

    try {
      setLoading(true)
      const response = await createEvent(newEvent)
      
      if (response.success) {
        setEvents([response.data, ...events])
        setNewEvent({
          title: "",
          description: "",
          date: "",
          location: "",
          attendees: 0,
          images: [],
        })
        showFeedback("Event created", "The event has been created successfully.")
      } else {
        showFeedback("Event not created", response.message || "Failed to create event.")
      }
    } catch (error) {
      console.error('Error creating event:', error)
      showFeedback("Event not created", "Failed to create event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMandate = async () => {
    if (!newMandate.name) {
      showFeedback("Missing information", "Please provide a mandate name for the executive committee.")
      return
    }

    try {
      setLoading(true)
      const response = await createExcomMandate(newMandate)

      if (response.success) {
        const created = response.data as ExcomMandateWithMembers
        setExcomMandates([created, ...excomMandates])
        setNewMandate({
          name: "",
          startYear: undefined,
          endYear: undefined,
          isCurrent: true,
        })
        setSelectedMandateId(created._id)
        showFeedback("Mandate created", "The executive committee mandate has been created successfully.")
      } else {
        showFeedback("Mandate not created", response.message || "Failed to create mandate.")
      }
    } catch (error) {
      console.error("Error creating mandate:", error)
      showFeedback("Mandate not created", "Failed to create mandate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!selectedMandateId) {
      showFeedback("Select a mandate", "Please select a mandate before adding members.")
      return
    }

    if (!newMember.name || !newMember.position) {
      showFeedback(
        "Missing information",
        "Please provide at least the member name and position for the executive committee member.",
      )
      return
    }

    try {
      setLoading(true)
      const response = await addExcomMember(selectedMandateId, newMember)

      if (response.success) {
        const createdMember = response.data as ExcomMember
        setExcomMandates(
          excomMandates.map((mandate) =>
            mandate._id === selectedMandateId
              ? {
                  ...mandate,
                  members: [...(mandate.members || []), createdMember],
                }
              : mandate,
          ),
        )
        setNewMember({
          name: "",
          position: "",
          image: "",
          facebook: "",
          email: "",
          linkedin: "",
          rank: undefined,
        })
        showFeedback("Member added", "The executive committee member has been added successfully.")
      } else {
        showFeedback("Member not added", response.message || "Failed to add member.")
      }
    } catch (error) {
      console.error("Error adding member:", error)
      showFeedback("Member not added", "Failed to add member. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    setEventToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return

    try {
      setLoading(true)
      const response = await deleteEvent(eventToDelete)
      
      if (response.success) {
        setEvents(events.filter((e) => e._id !== eventToDelete))
        showFeedback("Event deleted", "The event has been deleted successfully.")
      } else {
        showFeedback("Event not deleted", response.message || "Failed to delete event.")
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      showFeedback("Event not deleted", "Failed to delete event. Please try again.")
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
      setEventToDelete(null)
    }
  }

  const openEditMandate = (mandate: ExcomMandateWithMembers) => {
    setEditMandate({
      open: true,
      id: mandate._id,
      name: mandate.name,
      startYear: mandate.startYear ?? null,
      endYear: mandate.endYear ?? null,
      isCurrent: Boolean(mandate.isCurrent),
    })
  }

  const saveEditMandate = async () => {
    if (!editMandate.id) return

    try {
      setLoading(true)
      const response = await updateExcomMandate(editMandate.id, {
        name: editMandate.name,
        startYear: editMandate.startYear ?? null,
        endYear: editMandate.endYear ?? null,
        isCurrent: editMandate.isCurrent,
      })

      if (response.success) {
        const updated = response.data as ExcomMandateWithMembers
        setExcomMandates((prev) =>
          prev.map((m) => (m._id === updated._id ? { ...m, ...updated } : m)),
        )
        showFeedback("Mandate updated", "The executive committee mandate has been updated successfully.")
        setEditMandate((prev) => ({ ...prev, open: false }))
      } else {
        showFeedback("Mandate not updated", response.message || "Failed to update mandate.")
      }
    } catch (error) {
      console.error("Error updating mandate:", error)
      showFeedback("Mandate not updated", "Failed to update mandate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMandate = (id: string) => {
    setMandateToDelete(id)
    setMandateDeleteDialogOpen(true)
  }

  const confirmDeleteMandate = async () => {
    if (!mandateToDelete) return

    try {
      setLoading(true)
      const response = await deleteExcomMandate(mandateToDelete)

      if (response.success) {
        setExcomMandates((prev) => prev.filter((m) => m._id !== mandateToDelete))
        if (selectedMandateId === mandateToDelete) {
          setSelectedMandateId("")
        }
        showFeedback("Mandate deleted", "The executive committee mandate has been deleted successfully.")
      } else {
        showFeedback("Mandate not deleted", response.message || "Failed to delete mandate.")
      }
    } catch (error) {
      console.error("Error deleting mandate:", error)
      showFeedback("Mandate not deleted", "Failed to delete mandate. Please try again.")
    } finally {
      setLoading(false)
      setMandateDeleteDialogOpen(false)
      setMandateToDelete(null)
    }
  }

  const openEditMember = (mandateId: string, memberId: string, member: ExcomMemberData) => {
    setEditMember({
      open: true,
      mandateId,
      memberId,
      name: member.name,
      position: member.position,
      image: member.image,
      facebook: member.facebook,
      email: member.email,
      linkedin: member.linkedin,
      rank: member.rank ?? undefined,
    })
  }

  const saveEditMember = async () => {
    if (!editMember.mandateId || !editMember.memberId) return

    try {
      setLoading(true)
      const response = await updateExcomMember(editMember.mandateId, editMember.memberId, {
        name: editMember.name,
        position: editMember.position,
        image: editMember.image,
        facebook: editMember.facebook,
        email: editMember.email,
        linkedin: editMember.linkedin,
        rank: editMember.rank ?? undefined,
      })

      if (response.success) {
        const updated = response.data as ExcomMember
        setExcomMandates((prev) =>
          prev.map((mandate) =>
            mandate._id === editMember.mandateId
              ? {
                  ...mandate,
                  members: (mandate.members || []).map((m: any) =>
                    String((m as any)._id) === editMember.memberId ? { ...(m as any), ...updated } : m,
                  ),
                }
              : mandate,
          ),
        )
        showFeedback("Member updated", "The executive committee member has been updated successfully.")
        setEditMember((prev) => ({ ...prev, open: false }))
      } else {
        showFeedback("Member not updated", response.message || "Failed to update member.")
      }
    } catch (error) {
      console.error("Error updating member:", error)
      showFeedback("Member not updated", "Failed to update member. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = (mandateId: string, memberId: string) => {
    setMemberToDelete({ mandateId, memberId })
    setMemberDeleteDialogOpen(true)
  }

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return

    try {
      setLoading(true)
      const response = await deleteExcomMember(memberToDelete.mandateId, memberToDelete.memberId)

      if (response.success) {
        setExcomMandates((prev) =>
          prev.map((mandate) =>
            mandate._id === memberToDelete.mandateId
              ? {
                  ...mandate,
                  members: (mandate.members || []).filter(
                    (m: any) => String((m as any)._id) !== memberToDelete.memberId,
                  ),
                }
              : mandate,
          ),
        )
        showFeedback("Member deleted", "The executive committee member has been deleted successfully.")
      } else {
        showFeedback("Member not deleted", response.message || "Failed to delete member.")
      }
    } catch (error) {
      console.error("Error deleting member:", error)
      showFeedback("Member not deleted", "Failed to delete member. Please try again.")
    } finally {
      setLoading(false)
      setMemberDeleteDialogOpen(false)
      setMemberToDelete(null)
    }
  }

  const handleImageUpload = async (files: FileList | null, isEditing = false) => {
    if (!files || files.length === 0) return

    try {
      setLoading(true)
      
      // Convert FileList to Array
      const fileArray = Array.from(files)
      
      // Upload images to server
      const uploadResponse = await uploadImages(fileArray)
      
      if (uploadResponse.success) {
        // Extract URLs from the response
        const uploadedUrls = uploadResponse.files.map((file: { url: string; path: string }) => file.url)
        
        setNewEvent({
          ...newEvent,
          images: [...(newEvent.images || []), ...uploadedUrls],
        })
      } else {
        showFeedback("Upload failed", 'Failed to upload images: ' + uploadResponse.message)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      showFeedback("Upload failed", "Failed to upload images. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setNewEvent({
      ...newEvent,
      images: (newEvent.images || []).filter((_, i) => i !== index),
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wie-isimm.org"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter admin password"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="add-event">Add New Event</TabsTrigger>
            <TabsTrigger value="excom">Executive Committee</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>Manage your existing events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event._id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                        <div className="text-sm text-gray-500">
                          <span>
                            {event.date} • {event.location} • {event.attendees} attendees
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleDeleteEvent(event._id)} size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-event">
            <Card>
              <CardHeader>
                <CardTitle>Add New Event</CardTitle>
                <CardDescription>Create a new event for the WIE community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Enter event description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Enter event location"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendees">Number of Attendees</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent({ ...newEvent, attendees: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Enter number of attendees"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event Images</Label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {(newEvent.images || []).map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`New event image ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          onClick={() => removeImage(index)}
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="flex-1"
                      disabled={loading}
                    />
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    ) : (
                      <Upload className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {loading ? 'Uploading images...' : 'Upload multiple images for your event gallery'}
                  </p>
                </div>
                <Button onClick={handleAddEvent} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="excom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Mandate</CardTitle>
                <CardDescription>
                  Define a new executive committee mandate. You can then add members to it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mandate-name">Mandate Name</Label>
                  <Input
                    id="mandate-name"
                    value={newMandate.name}
                    onChange={(e) => setNewMandate({ ...newMandate, name: e.target.value })}
                    placeholder="e.g. 2024-2025"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-year">Start Year</Label>
                    <Input
                      id="start-year"
                      type="number"
                      value={newMandate.startYear ?? ""}
                      onChange={(e) =>
                        setNewMandate({
                          ...newMandate,
                          startYear: e.target.value ? Number.parseInt(e.target.value) || undefined : undefined,
                        })
                      }
                      placeholder="e.g. 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-year">End Year</Label>
                    <Input
                      id="end-year"
                      type="number"
                      value={newMandate.endYear ?? ""}
                      onChange={(e) =>
                        setNewMandate({
                          ...newMandate,
                          endYear: e.target.value ? Number.parseInt(e.target.value) || undefined : undefined,
                        })
                      }
                      placeholder="e.g. 2025"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="is-current"
                    type="checkbox"
                    checked={newMandate.isCurrent}
                    onChange={(e) => setNewMandate({ ...newMandate, isCurrent: e.target.checked })}
                  />
                  <Label htmlFor="is-current">Set as current mandate</Label>
                </div>
                <Button onClick={handleCreateMandate} className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create Mandate
                </Button>
                {excomMandates.length > 0 && (
                  <div className="pt-6 border-t mt-6 space-y-3">
                    <h3 className="font-semibold text-sm text-gray-700">Existing mandates</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {excomMandates.map((mandate) => (
                        <div
                          key={mandate._id}
                          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-medium">
                              {mandate.name} {mandate.isCurrent ? "(current)" : ""}
                            </p>
                            <p className="text-xs text-gray-500">
                              {mandate.startYear ?? "?"} - {mandate.endYear ?? "?"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openEditMandate(mandate)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDeleteMandate(mandate._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Members</CardTitle>
                <CardDescription>Select a mandate and add its executive committee members.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mandate-select">Select Mandate</Label>
                  <select
                    id="mandate-select"
                    className="w-full border rounded-md px-3 py-2"
                    value={selectedMandateId}
                    onChange={(e) => setSelectedMandateId(e.target.value)}
                  >
                    <option value="">-- Choose a mandate --</option>
                    {excomMandates.map((mandate) => (
                      <option key={mandate._id} value={mandate._id}>
                        {mandate.name}
                        {mandate.isCurrent ? " (current)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMandateId && (
                  <>
                    <div className="space-y-2">
                      <Label>Add Member</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="member-name">Name</Label>
                          <Input
                            id="member-name"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            placeholder="Full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member-position">Position</Label>
                          <Input
                            id="member-position"
                            value={newMember.position}
                            onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                            placeholder="e.g. Chairwoman, Vice Chair"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="member-image">Image URL</Label>
                      <div className="space-y-2">
                        <Label>Picture</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const files = e.target.files
                              if (!files || files.length === 0) return
                              try {
                                setMemberImageUploading(true)
                                const fileArray = Array.from(files)
                                const uploadResponse = await uploadImages(fileArray)
                                if (uploadResponse.success && uploadResponse.files?.length) {
                                  const firstUrl = uploadResponse.files[0].url
                                  setNewMember((prev) => ({ ...prev, image: firstUrl }))
                                  showFeedback("Picture uploaded", "The member picture has been uploaded successfully.")
                                } else {
                                  showFeedback(
                                    "Upload failed",
                                    uploadResponse.message || "Failed to upload member picture.",
                                  )
                                }
                              } catch (error) {
                                console.error("Error uploading member image:", error)
                                showFeedback("Upload failed", "Failed to upload member picture. Please try again.")
                              } finally {
                                setMemberImageUploading(false)
                                e.target.value = ""
                              }
                            }}
                            disabled={memberImageUploading}
                            className="flex-1"
                          />
                          {memberImageUploading && (
                            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                          )}
                        </div>
                        {newMember.image && (
                          <div className="mt-2">
                            <Image
                              src={newMember.image}
                              alt={newMember.name || "Member preview"}
                              width={80}
                              height={80}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member-email">Email</Label>
                          <Input
                            id="member-email"
                            type="email"
                            value={newMember.email || ""}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="member-facebook">Facebook URL</Label>
                          <Input
                            id="member-facebook"
                            value={newMember.facebook || ""}
                            onChange={(e) => setNewMember({ ...newMember, facebook: e.target.value })}
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member-linkedin">LinkedIn URL</Label>
                          <Input
                            id="member-linkedin"
                            value={newMember.linkedin || ""}
                            onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
                            placeholder="https://www.linkedin.com/in/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member-rank">Display Rank</Label>
                          <Input
                            id="member-rank"
                            type="number"
                            value={newMember.rank ?? ""}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                rank: e.target.value ? Number.parseInt(e.target.value) || undefined : undefined,
                              })
                            }
                            placeholder="1 shows first, 2 shows second, ..."
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddMember} disabled={loading} className="mt-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Add Member
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Current Members</Label>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {excomMandates
                          .find((m) => m._id === selectedMandateId)
                          ?.members?.map((member, index) => (
                            <div key={index} className="border rounded-lg p-4 flex items-center space-x-4">
                              {member.image ? (
                                <Image
                                  src={member.image}
                                  alt={member.name}
                                  width={64}
                                  height={64}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200" />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.position}</p>
                                {member.rank != null && (
                                  <p className="text-xs text-gray-400">Rank: {member.rank}</p>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() =>
                                    openEditMember(
                                      selectedMandateId,
                                      (member as any)._id as string,
                                      member,
                                    )
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteMember(
                                      selectedMandateId,
                                      (member as any)._id as string,
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog
        open={feedbackDialog.open}
        onOpenChange={(open) => setFeedbackDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{feedbackDialog.title}</DialogTitle>
            <DialogDescription>{feedbackDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setFeedbackDialog((prev) => ({ ...prev, open: false }))}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEvent} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editMandate.open}
        onOpenChange={(open) => setEditMandate((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit mandate</DialogTitle>
            <DialogDescription>Update the details of this executive committee mandate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="edit-mandate-name">Name</Label>
              <Input
                id="edit-mandate-name"
                value={editMandate.name}
                onChange={(e) => setEditMandate((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-start-year">Start year</Label>
                <Input
                  id="edit-start-year"
                  type="number"
                  value={editMandate.startYear ?? ""}
                  onChange={(e) =>
                    setEditMandate((prev) => ({
                      ...prev,
                      startYear: e.target.value ? Number.parseInt(e.target.value) || null : null,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-end-year">End year</Label>
                <Input
                  id="edit-end-year"
                  type="number"
                  value={editMandate.endYear ?? ""}
                  onChange={(e) =>
                    setEditMandate((prev) => ({
                      ...prev,
                      endYear: e.target.value ? Number.parseInt(e.target.value) || null : null,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <input
                id="edit-is-current"
                type="checkbox"
                checked={editMandate.isCurrent}
                onChange={(e) =>
                  setEditMandate((prev) => ({
                    ...prev,
                    isCurrent: e.target.checked,
                  }))
                }
              />
              <Label htmlFor="edit-is-current">Set as current mandate</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMandate((prev) => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button onClick={saveEditMandate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={mandateDeleteDialogOpen}
        onOpenChange={setMandateDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete mandate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this mandate and all its members? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMandateDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMandate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editMember.open}
        onOpenChange={(open) => setEditMember((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
            <DialogDescription>Update the details of this executive committee member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-member-name">Name</Label>
                <Input
                  id="edit-member-name"
                  value={editMember.name}
                  onChange={(e) => setEditMember((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-member-position">Position</Label>
                <Input
                  id="edit-member-position"
                  value={editMember.position}
                  onChange={(e) => setEditMember((prev) => ({ ...prev, position: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-member-email">Email</Label>
              <Input
                id="edit-member-email"
                type="email"
                value={editMember.email || ""}
                onChange={(e) => setEditMember((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-member-facebook">Facebook URL</Label>
                <Input
                  id="edit-member-facebook"
                  value={editMember.facebook || ""}
                  onChange={(e) => setEditMember((prev) => ({ ...prev, facebook: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-member-linkedin">LinkedIn URL</Label>
                <Input
                  id="edit-member-linkedin"
                  value={editMember.linkedin || ""}
                  onChange={(e) => setEditMember((prev) => ({ ...prev, linkedin: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-member-rank">Display rank</Label>
                <Input
                  id="edit-member-rank"
                  type="number"
                  value={editMember.rank ?? ""}
                  onChange={(e) =>
                    setEditMember((prev) => ({
                      ...prev,
                      rank: e.target.value ? Number.parseInt(e.target.value) || null : null,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-member-image">Picture URL</Label>
                <Input
                  id="edit-member-image"
                  value={editMember.image || ""}
                  onChange={(e) => setEditMember((prev) => ({ ...prev, image: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMember((prev) => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button onClick={saveEditMember} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={memberDeleteDialogOpen}
        onOpenChange={setMemberDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this executive committee member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMember} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
