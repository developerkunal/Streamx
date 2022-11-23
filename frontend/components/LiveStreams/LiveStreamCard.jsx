import { useEffect, useState } from "react"
import { Card, Col, Row, Button, Text, Modal, Input, Loading,Link } from "@nextui-org/react"

import { useRouter } from 'next/router'
import  axios from "axios"

export default function LiveStreamCard({ id }) {
    const live_peer = process.env.NEXT_PUBLIC_LIVE_PEER

    const router = useRouter()
    const [assetid, setAssetid]= useState("");
    const [name ,setName] = useState();
    const [playback ,setPlayback] = useState();
    async function fetchstream(id){

            var config = {
            method: 'get',
            url: `https://livepeer.studio/api/stream/${id}`,
            headers: { 
                'authorization': `Bearer ${live_peer}`
            }
            };

           const data =  await axios(config)
           console.log(data)
            setName(data.data.name)
            setAssetid(data.data.id)
            setPlayback(data.data.playbackId)
    }

    useEffect(() => {
        fetchstream(id)
    }, [])

    

    return (
        <>{assetid?
            <Card cover css={{ w: "100%", p: 0 }}>
                <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}><p>LIVE🔴</p>
                </Card.Header>
                <Card.Body>
                    <Card.Image
                        src={"https://ipfs.io/ipfs/bafkreignc5w4vry2bx4ruabddyfamru7c7cxw6tccbpjft45gj5svh4mme"}
                        height={400}
                        width="100%"
                        alt="Relaxing app background"
                    />
                </Card.Body>
                <Card.Footer
                    blur
                    css={{
                        backgroundColor: "#000",
                        position: "absolute",
                        bgBlur: "#000",
                        borderTop: "$borderWeights$light solid $gray700",
                        bottom: 0,
                        zIndex: 1,
                    }}
                >
                    <Row>
                        <Col css={{ marginTop: "1%" }} bottom={0}>
                            <Text size={12} transform="uppercase" color="#fff">
                                {name}
                            </Text>
                        </Col>
                        <Col>
                            <Row justify="flex-end">
                                <Button.Group color="success" >
                                    <Link href={`liveplayer/${assetid}`}>
                                    <Button
                                        rounded
                                    >
                                        <Text
                                            css={{ color: "inherit" }}
                                            size={12}
                                            weight="bold"
                                            transform="uppercase"
                                        >
                                            View Video
                                        </Text>
                                    </Button>
                                    </Link>
                                </Button.Group>
                            </Row>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
: <Loading/>}
           
        </>
    )
}
