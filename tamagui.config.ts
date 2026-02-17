import { createTamagui } from 'tamagui'
import { config as configV3 } from '@tamagui/config/v3'
import { createAnimations } from '@tamagui/animations-reanimated'

const animations = createAnimations({
  bouncy: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
})

export const config = createTamagui({
  ...configV3,
  animations,
})

export default config
