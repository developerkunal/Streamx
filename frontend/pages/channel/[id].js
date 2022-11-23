import { Container } from "@nextui-org/react"
import Navigation from "../../components/Navigation"
import Channel from "../../components/Channel/Channel"
import { useRouter } from 'next/router';


export default function MyNfts() {
    const router = useRouter()

    const { id } = router.query
  return (
    <> 
      <div>
        <Navigation />
      </div>
      <Container>
        {id &&
        <Channel id={id} />
        }</Container>
    </>
  )
}