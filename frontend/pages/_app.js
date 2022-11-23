import '../styles/globals.css'
import { createReactClient ,LivepeerConfig } from "@livepeer/react";
import { studioProvider } from "livepeer/providers/studio";
const LivePeerClient = createReactClient({
  provider: studioProvider({ apiKey: process.env.LIVE_PEER }),
});

function MyApp({ Component, pageProps }) {
  return (

  <LivepeerConfig client={LivePeerClient}>
  <Component {...pageProps} />
  </LivepeerConfig>
  )
}

export default MyApp
