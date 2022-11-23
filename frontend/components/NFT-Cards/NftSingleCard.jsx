import { useEffect, useState } from "react"
import { Card, Col, Row, Button, Text, Modal, Image, Loading,Link } from "@nextui-org/react"
import Streamx from '../../contracts/Streamx.json'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'


export default function NftSingleCard({ id }) {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)

    const [itemId, setItemId] = useState()
    const [itemName, setItemName] = useState()
    const [itemDescription, setItemDescription] = useState()
    const [itemOwner, setItemOwner] = useState()
    const [itemUrl, setItemUrl] = useState()
    const [profileimage , setProfile] =useState()
    const [walletAddress, setWalletAddress] = useState()

    
    async function getSingleItems() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            let contract = new ethers.Contract(id, Streamx.abi, provider)
            let Contractid = await contract.id()
            let name = await contract.name()
            let description = await contract.description()
            let owner = await contract.owner()
            let image = await contract.url()
            let profileimage = await contract.getImageUrls()

            setItemId(Contractid)
            setItemDescription(description)
            setItemName(name)
            setItemOwner(owner)
            setItemUrl(image)
            setProfile(profileimage[0])
        } catch (err) {
            Swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'Close',
            })
        }
    }

    async function getWalletAddress() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            setWalletAddress(address)

        } catch (err) {
            console.log(err)
            console.log(walletAddress)
        }
    }

    useEffect(() => {
        getSingleItems()
        getWalletAddress()
    }, [])

    

    return (
        <>
            <Card cover css={{ w: "100%", p: 0 }}>
                <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                </Card.Header>
                <Card.Body>
                    <Card.Image
                        src={`https://ipfs.io/ipfs/${profileimage}`}
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
                                {itemName}
                            </Text>
                        </Col>
                        <Col>
                            <Row justify="flex-end">
                                <Button.Group color="success" >
                                    <Button
                                        rounded
                                    ><a href={`channel/${itemId}`}>
                                        <Text
                                            css={{ color: "inherit" }}
                                            size={12}
                                            weight="bold"
                                            transform="uppercase"
                                        >
                                            View Channel
                                        </Text>
                                        </a>
                                    </Button>
                                </Button.Group>
                            </Row>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>

           
        </>
    )
}
