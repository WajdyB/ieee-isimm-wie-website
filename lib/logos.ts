// Logo configuration for the WIE ISIMM website
export const logos = {
  wie: {
    src: "/logos/wie-isimm-logo.png",
    alt: "WIE ISIMM Logo",
    width: 180,
    height: 75,
    className: "h-16 w-auto",
  },
  ieee: {
    src: "/logos/ieee-tunisia-logo.png",
    alt: "IEEE Tunisia Section",
    width: 180,
    height: 75,
    className: "h-16 w-auto",
  },
  ieeeMobile: {
    src: "/logos/ieee-tunisia-logo.png",
    alt: "IEEE Tunisia Section",
    width: 140,
    height: 60,
    className: "h-12 w-auto",
  },
} as const

// Logo component props type
export type LogoProps = {
  type: keyof typeof logos
  className?: string
}

// Helper function to get logo configuration
export const getLogoConfig = (type: keyof typeof logos) => {
  return logos[type]
} 