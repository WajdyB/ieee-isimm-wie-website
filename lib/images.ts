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
      src: "/images/placeholder.jpg", // Event/Activity 1
      alt: "WIE ISIMM Event 1",
      title: "Event 1",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 2
      alt: "WIE ISIMM Event 2", 
      title: "Event 2",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 3
      alt: "WIE ISIMM Event 3",
      title: "Event 3",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 4
      alt: "WIE ISIMM Event 4",
      title: "Event 4",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 5
      alt: "WIE ISIMM Event 5",
      title: "Event 5",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 6
      alt: "WIE ISIMM Event 6",
      title: "Event 6",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 7
      alt: "WIE ISIMM Event 7",
      title: "Event 7",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 8
      alt: "WIE ISIMM Event 8",
      title: "Event 8",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 9
      alt: "WIE ISIMM Event 9",
      title: "Event 9",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 10
      alt: "WIE ISIMM Event 10",
      title: "Event 10",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 11
      alt: "WIE ISIMM Event 11",
      title: "Event 11",
      width: 300,
      height: 300,
    },
    {
      src: "/images/placeholder.jpg", // Event/Activity 12
      alt: "WIE ISIMM Event 12",
      title: "Event 12",
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
      image: "/images/committee/dorra_barbria.png", // You'll add this image
      facebook: "https://facebook.com/dorra.barbria",
      email: "dorra@wie-isimm.org",
      linkedin: "https://linkedin.com/in/dorra-barbria",
    },
    {
      name: "Chifa Guesmi",
      position: "Vice Chair",
      image: "/images/committee/chifa_guesmi.jpeg", // You'll add this image
      facebook: "https://facebook.com/chifa.guesmi",
      email: "chifa@wie-isimm.org",
      linkedin: "https://linkedin.com/in/chifa-guesmi",
    },
    {
      name: "Maryem Teborbi",
      position: "Secretary",
      image: "/images/committee/maryem_teborbi.png", // You'll add this image
      facebook: "https://facebook.com/maryem.teborbi",
      email: "maryem@wie-isimm.org",
      linkedin: "https://linkedin.com/in/maryem-teborbi",
    },
    {
      name: "Miniar Guizani",
      position: "Treasurer",
      image: "/images/committee/miniar_guizani.png", // You'll add this image
      facebook: "https://facebook.com/miniar.guizani",
      email: "miniar@wie-isimm.org",
      linkedin: "https://linkedin.com/in/miniar-guizani",
    },
    {
      name: "Malek Aarfaoui",
      position: "Webmaster",
      image: "/images/committee/malek_aarfaoui.png", // You'll add this image
      facebook: "https://facebook.com/malek.aarfaoui",
      email: "malek@wie-isimm.org",
      linkedin: "https://linkedin.com/in/malek-aarfaoui",
    },
  ],
  
  // Chairwoman photo for leadership message section
  chair: {
    src: "/images/committee/dorra_barbria.png", // Same as chairwoman's main photo
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