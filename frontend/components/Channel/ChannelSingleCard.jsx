import { useEffect, useState } from "react"
import { Card, Col, Row, Button, Text, Modal, Input, Loading,Link } from "@nextui-org/react"

import { useRouter } from 'next/router'
import  axios from "axios"


export default function OwnedSingleCard({ id }) {

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [animation_url,setAnimation] = useState();
    const [assetid, setAssetid]= useState("");
    const [description, setDescription] = useState();
    const [image,setImage] = useState();
    const [name ,setName] = useState();

    async function fetchnfts(id){
        const url = id.slice(7);
        const {data:{assetid,animation_url,description,image,name}} = await axios.get(`https://ipfs.io/ipfs/${url}`)
        setAssetid(assetid);
        setDescription(description)
        setImage(image.slice(7));
        setAnimation(animation_url)
        setName(name)
    }

    useEffect(() => {
        fetchnfts(id)
    }, [])

    

    return (
        <>{assetid?
            <Card cover css={{ w: "100%", p: 0 }}>
                <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                </Card.Header>
                <Card.Body>
                    <Card.Image
                        src={`https://ipfs.io/ipfs/${image}`}
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
                                    <Link href={`videoAssets/${assetid}`}>
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
