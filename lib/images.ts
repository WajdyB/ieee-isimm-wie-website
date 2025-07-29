// Images configuration for the WIE ISIMM website
export const aboutImages = {
  // Mission & Vision section image
  mission: {
    src: "/images/about/about-image.png", // You'll add this image
    alt: "WIE ISIMM Mission and Vision",
    width: 600,
    height: 500,
    className: "relative rounded-3xl shadow-2xl object-cover",
  },
  
  // Photo Gallery images - you can add up to 12 images
  gallery: [
    {
      src: "/images/events/self-kowledge.png", // Event/Activity 1
      alt: "Self Knowledge Workshop",
      title: "Self Knowledge Workshop",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/breast-cancer.jpg", // Event/Activity 2
      alt: "Breast Cancer Awareness", 
      title: "Breast Cancer Awareness",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/think-like-a-programmer.jpg", // Event/Activity 3
      alt: "Think like a programmer",
      title: "Think like a programmer",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/wie-heal-1.jpg", // Event/Activity 4
      alt: "WIE HEAL 1.0",
      title: "WIE HEAL 1.0",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/wie-care-and-share.jpg", // Event/Activity 5
      alt: "WIE Care and Share",
      title: "WIE Care and Share",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/ui-ux-design-workshop-1.jpg", // Event/Activity 6
      alt: "UI/UX Design Workshop",
      title: "UI/UX Design Workshop",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/wie-empower-her.jpg", // Event/Activity 7
      alt: "WIE Empower Her",
      title: "WIE Empower Her",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/her-brilliance-our-future.jpg", // Event/Activity 8
      alt: "Her Brilliance Our Future",
      title: "Her Brilliance Our Future",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/stress-management.jpg", // Event/Activity 9
      alt: "Stress Management",
      title: "Stress Management",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/ai-pulse.jpg", // Event/Activity 10
      alt: "AI Pulse",
      title: "AI Pulse",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/ui-ux-design-workshop-2.jpg", // Event/Activity 11
      alt: "UI/UX Design Workshop",
      title: "UI/UX Design Workshop",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/crafting-your-speech.jpg", // Event/Activity 12
      alt: "Crafting Your Speech",
      title: "Crafting Your Speech",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/wie-guide.jpg", // Event/Activity 13
      alt: "WIE Guide",
      title: "WIE Guide",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/wie-care-and-share-2.jpg", // Event/Activity 14
      alt: "WIE Care and Share 2.0",
      title: "WIE Care and Share 2.0",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/wie-heal-3.0.jpg", // Event/Activity 15
      alt: "WIE HEAL 3.0",
      title: "WIE HEAL 3.0",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/coffee-talk.jpg", // Event/Activity 16
      alt: "Coffee Talk",
      title: "Coffee Talk",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/wie-lead.jpg", // Event/Activity 17
      alt: "WIE LEAD",
      title: "WIE LEAD",
      width: 300,
      height: 300,
    },
    {
      src: "/images/events/takwiera.jpg", // Event/Activity 18
      alt: "TAKWIERA",
      title: "TAKWIERA",
      width: 300,
      height: 300,
    },
    
  ],
} as const

// Homepage images configuration
export const homeImages = {
  // Hero section image
  hero: {
    src: "/images/placeholder.jpg", // Updated to match actual filename
    alt: "WIE ISIMM Members",
    width: 600,
    height: 500,
    className: "relative rounded-3xl shadow-2xl object-cover",
  },
  
  // Recent events preview images
  recentEvents: [
    {
      src: "/images/placeholder.jpg", // Recent event 1
      alt: "Leadership Workshop",
      title: "Workshop on Leadership",
      description: "Empowering women through leadership skills and professional development.",
      width: 400,
      height: 200,
    },
    {
      src: "/images/placeholder.jpg", // Recent event 2
      alt: "Coding Workshop",
      title: "Coding Workshop for Beginners",
      description: "An introductory workshop designed to teach basic programming concepts.",
      width: 400,
      height: 200,
    },
    {
      src: "/images/placeholder.jpg", // Recent event 3
      alt: "Career Development Seminar",
      title: "Career Development Seminar",
      description: "Professional development session covering resume building and interview skills.",
      width: 400,
      height: 200,
    },
  ],
} as const

// Committee images configuration
export const committeeImages = {
  // Committee member photos - Updated with actual WIE ISIMM committee members
  members: [
    {
      name: "Dorra Barbria",
      position: "Chairwoman",
      image: "/images/committee/dorra_barbria.png", 
      facebook: "https://facebook.com/dorra.barbria",
      email: "dbarbria@gmail.com",
      linkedin: "https://www.linkedin.com/in/dorra-barbria-254947280/",
    },
    {
      name: "Chifa Guesmi",
      position: "Vice Chair",
      image: "/images/committee/chifa_guesmi.jpeg", 
      facebook: "https://www.facebook.com/chifa.guesmy",
      email: "chifaguesmi@ieee.org",
      linkedin: "https://www.linkedin.com/in/chifa-guesmi-7ab213284/",
    },
    {
      name: "Maryem Teborbi",
      position: "Secretary",
      image: "/images/committee/maryem_teborbi.png", 
      facebook: "https://www.facebook.com/maryem.teborbi",
      email: "maryemteborbi0@ieee.org",
      linkedin: "https://www.linkedin.com/in/maryem-teborbi-a06b79300/",
    },
    {
      name: "Miniar Guizani",
      position: "Treasurer",
      image: "/images/committee/miniar_guizani.png", 
      facebook: "https://www.facebook.com/miniar.guizani",
      email: "miniarguizeni@gmail.com",
      linkedin: "https://www.linkedin.com/in/miniar-guizeni-5b1841377/",
    },
    {
      name: "Malek Aarfaoui",
      position: "Webmaster",
      image: "/images/committee/malek_aarfaoui.png", 
      facebook: "https://www.facebook.com/malek.arfaoui.792",
      email: "arfaoui.malek04@icloud.com",
      linkedin: "https://www.linkedin.com/in/arfaoui-malek-9518652a1/",
    },
  ],
  
  // Chairwoman photo for leadership message section
  chair: {
    src: "/images/committee/dorra_barbria.png", 
    alt: "Dorra Barbria - Chairwoman",
    width: 80,
    height: 80,
    className: "w-16 h-16 rounded-full object-cover mr-4",
  },
} as const

// Helper function to get gallery images (with fallback to placeholders)
export const getGalleryImages = () => {
  return aboutImages.gallery.map((image, index) => ({
    ...image,
    // Fallback to placeholder if image doesn't exist
    src: image.src.startsWith('/placeholder') ? image.src : image.src,
  }))
}

// Helper function to get recent events images
export const getRecentEventsImages = () => {
  return homeImages.recentEvents.map((image, index) => ({
    ...image,
    // Fallback to placeholder if image doesn't exist
    src: image.src.startsWith('/placeholder') ? image.src : image.src,
  }))
}

// Helper function to get committee members with fallback images
export const getCommitteeMembers = () => {
  return committeeImages.members.map((member, index) => ({
    ...member,
    // Fallback to placeholder if image doesn't exist
    image: member.image.startsWith('/placeholder') ? member.image : member.image,
  }))
}