import { useEffect, useState } from "react"
import { Grid, Row, Col, Text } from "@nextui-org/react"
import LiveStreamCard from "./LiveStreamCard"

import { useRouter } from 'next/router'
import axios from 'axios'

export default function Livestreams() {
    const live_peer = process.env.NEXT_PUBLIC_LIVE_PEER
    const router = useRouter()
    const [allItems, setAllItems] = useState([])
    async function fetchStreams(){

     const data = await axios.get(`https://livepeer.studio/api/stream?streamsonly=1&filters=[{"id": "isActive", "value": true}]`,
    { headers: { 
       'authorization': `Bearer ${live_peer}`
     }})
    setAllItems(data.data)

    }
    useEffect(() => {
    fetchStreams()
    }, [ ])


    return (
        <><h1>Live Streams</h1>
        {allItems.length > 0 ? 
            <Grid.Container gap={2} justify="center">
                {allItems.map((items, i) =>
                    items.itemId != 0 ?
                        <Grid key={i} xs={12} sm={4} md={3}>
                            <LiveStreamCard id={items.id} />
                        </Grid>
                    : ""
                )}
            </Grid.Container> : 
            <Row justify="center">
                <Col align={"center"}>
                    <Text h2>
                        No Items To Fetch
                    </Text>
                </Col>
            </Row>
        }
        </>
    )
}