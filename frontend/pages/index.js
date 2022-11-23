import { Container } from "@nextui-org/react";
import Navigation from "../components/Navigation"
import NftGrid from "../components/NFT-Cards/NftGrid"
import Videos from "../components/Allvideos/Videos"
import Livestreams from "../components/LiveStreams/Livestream"

export default function Home() {
  return (
    <>
      <div>
        <Navigation />
      </div>
      <Container>
        <Livestreams/>
        <NftGrid />
        <Videos/>
      </Container>
    </>
  )
}
