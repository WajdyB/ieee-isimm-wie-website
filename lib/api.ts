// API service functions for admin operations

export interface LoginCredentials {
  email: string
  password: string
}

export interface EventData {
  eventType: "upcoming" | "previous"
  title: string
  description: string
  date: string
  location: string
  attendees?: number
  registrationLink?: string
  picture?: string
  images?: string[] // URLs returned from /api/upload, now served from MongoDB GridFS
}

export interface ProjectData {
  title: string
  description: string
  technologies: string[]
  link: string
  picture?: string
}

export interface Project extends ProjectData {
  _id: string
  created_at?: string
  updated_at?: string
}

export interface ExcomMemberData {
  name: string
  position: string
  image?: string
  facebook?: string
  email?: string
  linkedin?: string
  rank?: number
}

export interface ExcomMember extends ExcomMemberData {
  _id: string
  created_at?: string
  updated_at?: string
}

export interface ExcomMandate {
  _id: string
  name: string
  startYear?: number | null
  endYear?: number | null
  isCurrent?: boolean
  members?: ExcomMember[]
  created_at?: string
  updated_at?: string
}

// Authentication
export async function loginAdmin(credentials: LoginCredentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  return response.json()
}

// Image Upload
export async function uploadImages(files: File[]) {
  const formData = new FormData()
  
  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()
  
  // Extract URLs from the response for backward compatibility
  if (result.success && result.files) {
    result.urls = result.files.map((file: { url: string; id: string; filename: string }) => file.url)
  }
  
  return result
}

// Events API
export async function getEvents() {
  const response = await fetch('/api/events')
  const data = await response.json()
  return data
}

export async function createEvent(eventData: EventData) {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })

  return response.json()
}

export async function deleteEvent(id: string) {
  const response = await fetch(`/api/events/${id}`, {
    method: 'DELETE',
  })

  return response.json()
}

// Projects API
export async function getProjects() {
  const response = await fetch('/api/projects')
  return response.json()
}

export async function createProject(projectData: ProjectData) {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  })

  return response.json()
}

export async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  })

  return response.json()
}

export async function updateProject(id: string, updates: Partial<ProjectData>) {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  return response.json()
}

// Executive Committee API
export async function getExcomMandates() {
  const response = await fetch("/api/excom/mandates")
  const data = await response.json()
  return data
}

export async function createExcomMandate(mandate: {
  name: string
  startYear?: number
  endYear?: number
  isCurrent?: boolean
}) {
  const response = await fetch("/api/excom/mandates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mandate),
  })

  return response.json()
}

export async function addExcomMember(mandateId: string, member: ExcomMemberData) {
  const response = await fetch(`/api/excom/mandates/${mandateId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  })

  return response.json()
}

export async function updateExcomMandate(
  id: string,
  updates: Partial<{
    name: string
    startYear?: number | null
    endYear?: number | null
    isCurrent?: boolean
  }>,
) {
  const response = await fetch(`/api/excom/mandates/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })

  return response.json()
}

export async function deleteExcomMandate(id: string) {
  const response = await fetch(`/api/excom/mandates/${id}`, {
    method: "DELETE",
  })

  return response.json()
}

export async function updateExcomMember(
  mandateId: string,
  memberId: string,
  updates: Partial<ExcomMemberData>,
) {
  const response = await fetch(`/api/excom/mandates/${mandateId}/members/${memberId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })

  return response.json()
}

export async function deleteExcomMember(mandateId: string, memberId: string) {
  const response = await fetch(`/api/excom/mandates/${mandateId}/members/${memberId}`, {
    method: "DELETE",
  })

  return response.json()
}

// Messages API
export interface Message {
  _id: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

export async function getMessages() {
  const response = await fetch('/api/messages')
  return response.json()
}

export async function markMessageAsRead(id: string, read: boolean = true) {
  const response = await fetch('/api/messages', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, read }),
  })
  return response.json()
}

export async function deleteMessage(id: string) {
  const response = await fetch(`/api/messages?id=${id}`, {
    method: 'DELETE',
  })
  return response.json()
}