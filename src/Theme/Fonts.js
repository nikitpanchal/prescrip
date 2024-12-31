const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  input: 18,
  regular: 17,
  medium: 14,
  small: 12,
}

const style = {
  h1: {
    fontSize: size.h1,
  },
  h2: {
    fontSize: size.h2,
  },
  h3: {
    fontSize: size.h3,
  },
  normal: {
    fontSize: size.regular,
  },
}

const customFontFamily = {
  SpaceGrotesk_Bold: {
    fontFamily:"SpaceGrotesk-Bold"
  },
  SpaceGrotesk_Light: {
    fontFamily:"SpaceGrotesk-Light"
  },
  SpaceGrotesk_Medium: {
    fontFamily:"SpaceGrotesk-Medium"
  },
  SpaceGrotesk_Regular: {
    fontFamily:"SpaceGrotesk-Regular"
  },
  SpaceGrotesk_SemiBold: {
    fontFamily:"SpaceGrotesk-SemiBold"
  },
}

export default {
  size,
  style,
  customFontFamily
}
