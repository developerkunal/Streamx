import { Container } from "@nextui-org/react"
import Navigation from "../components/Navigation"
import ViewStream from "../components/viewstream"

export default function MyNfts() {
  return (
    <>
      <div>
        <Navigation />
      </div>
      <Container>
        <ViewStream/>
      </Container>
    </>
  )
}