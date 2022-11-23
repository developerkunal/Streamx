import { Container } from "@nextui-org/react"
import Navigation from "../components/Navigation"
import OwnedNftGrid from "../components/Owned-NFT-Cards/OwnedNftGrid"


export default function MyNfts() {
  return (
    <>
      <div>
        <Navigation />
      </div>
      <Container>
        <OwnedNftGrid />
      </Container>
    </>
  )
}