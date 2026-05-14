// responsive: true  → width: 100% / height: auto (escala con el contenedor)
// responsive: false → dimensiones fijas en px

export const IMAGE_SIZES = {
  small:  { width: 120, height: 67,  sizes: "120px",                           responsive: false },
  medium: { width: 300, height: 169, sizes: "(min-width: 768px) 300px, 90vw",  responsive: false },
  large:  { width: 600, height: 338, sizes: "(min-width: 768px) 50vw, 90vw",   responsive: true  },
  xl:     { width: 800, height: 450, sizes: "(min-width: 768px) 100vw, 90vw",  responsive: true  },
  mobile: { width: 800, height: 450, sizes: "(min-width: 768px) 40vw, 90vw",   responsive: true  },
}