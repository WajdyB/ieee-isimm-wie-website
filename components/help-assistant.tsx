"use client"

import { useState } from "react"
import { X, Send } from "lucide-react"
import Image from "next/image"

export default function HelpAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !message.trim()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Submit to the API route which saves to MongoDB
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setEmail("")
        setMessage("")
        
        // Close dialog after 2 seconds
        setTimeout(() => {
          setIsOpen(false)
          setSubmitStatus("idle")
        }, 2000)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting question:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-40 group"
        aria-label="Help Assistant"
      >
        <div className="relative">
          {/* Mascot Icon */}
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border-2 border-primary/50 hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 overflow-hidden">
            <Image
              src="/logos/touta.png"
              alt="Touta Mascot"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Pulsing indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full" />
        </div>
      </button>

      {/* Help Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-lg shadow-2xl max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logos/touta.png"
                    alt="Touta"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Help Assistant</h3>
                  <p className="text-sm text-muted-foreground">Touta is here to help!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-white font-medium">
                Do you have any questions or suggestions?
              </p>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-muted-foreground">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting || submitStatus === "success"}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-muted-foreground">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question or suggestion here..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  disabled={isSubmitting || submitStatus === "success"}
                />
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  ✗ Something went wrong. Please try again or contact us directly.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!email.trim() || !message.trim() || isSubmitting || submitStatus === "success"}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : submitStatus === "success" ? (
                  "Sent!"
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
