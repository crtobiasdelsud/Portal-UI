// Íconos de redes del ShareBlock — componentes SVG inline, monocromos.
// Cada uno usa `fill="currentColor"`, así el color (y el hover) lo controla
// el CSS del componente `Icon` (ver Icon.module.scss).
import X        from './X.jsx'
import Facebook from './Facebook.jsx'
import Linkedin from './Linkedin.jsx'
import Telegram from './Telegram.jsx'
import Whatsapp from './Whatsapp.jsx'
import Email    from './Email.jsx'

export const NETWORK_ICONS = {
  x:        X,
  facebook: Facebook,
  linkedin: Linkedin,
  telegram: Telegram,
  whatsapp: Whatsapp,
  email:    Email,
}
