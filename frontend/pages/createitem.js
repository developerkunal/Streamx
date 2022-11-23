
import { useState, useEffect } from 'react'
import { Container, Input, Row, Button, Loading ,Progress} from "@nextui-org/react"
import Navigation from "../components/Navigation"
import { ethers } from 'ethers'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import StreamxFactory from '../contracts/StreamxFactory.json'
import Streamx from '../contracts/Streamx.json'
import { videonft } from '@livepeer/video-nft'
import { NFTStorage, File, Blob } from 'nft.storage'

export default function MyNfts() {
    const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
    const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT;

    const [isLoading, setIsLoading] = useState(false)
    const [fileUrl, setFileUrl] = useState("")
    const router = useRouter()
    const [mycontract,setMycontract] = useState("")
    const vodApi = new videonft.minter.Api({ auth:{apiKey:process.env.NEXT_PUBLIC_LIVE_PEER}});
    const [file, setFile] = useState("");
    const [images, setImage] = useState("");

    const [assetName, setAssetName] = useState("");
    const [assetDesc, setAssetDesc] = useState("");
    
    async function checkForWallet() {
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            console.log(walletAddress)
        } catch(err){
            Swal.fire({
                title: 'Error',
                text: "Connect Wallet First",
                icon: 'error',
                confirmButtonText: 'close',
            }).then(() => {
                router.push('/')
            })
        }
    }
    async function fetchContract(){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            let contract = new ethers.Contract(CONTRACT, StreamxFactory.abi, signer)
            let contractaddress = await contract.getOwnedItems(walletAddress)
            setMycontract(contractaddress.filter(obj => obj[1] === walletAddress)[0][2])
        }catch(err){
            Swal.fire({
                title: 'Error',
                text: "Connect Wallet",
                icon: 'error',
                confirmButtonText: 'close',
            }).then(() => {
                router.push('/')
            })
        }
    }
    useEffect(() => {
        checkForWallet()
        fetchContract()
    }, [mycontract])
    const listItem = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const someData = new Blob([images]);
        const cid = await client.storeBlob(someData);
        let asset = await vodApi.createAsset(assetName, file);

        asset = await vodApi.nftNormalize(asset);

        const nftMetadata = {
          description: assetDesc,
          assetid:asset.id,
          image:"ipfs://" + cid

        };
        const ipfs = await vodApi.exportToIPFS(asset.id, nftMetadata);
        console.log(ipfs)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(mycontract, Streamx.abi, signer)
        try {
            const tx = await contract.safeMint(await signer.getAddress(),ipfs.nftMetadataUrl)
            await tx.wait()
            Swal.fire({
                title: 'Success',
                html: `Transaction successfully <br><a href="https://testnet.aurorascan.dev/tx/${tx.hash}"><u>view on explorer</u></a> `,
                icon: 'Success',
                confirmButtonText: 'Done',
            }).then(
                router.push('/')
            )
            setIsLoading(false)
        } catch (err) {
            console.log(err.message)
            Swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'Close',
            })
            setIsLoading(false)
        }
    }

    return (
        <>
       
            <div>
                <Navigation />
            </div>
            <Container>
                <form onSubmit={listItem}>
                    <Row css={{ padding: "30px 0" }} justify="center" align="center">
                        <Input
                            size="lg"
                            bordered
                            name="name"
                            label="Name"
                            color="#7928ca"
                            helperText="Please enter NFT name"
                            onChange={(e) => setAssetName(e.target.value)}
                            value={assetName}
                            required
                        />
                    </Row>
                    <Row css={{ padding: "30px 0" }} justify="center">
                        <Input
                            size="lg"
                            bordered
                            name="desc"
                            color="#7928ca"
                            label="Item description"
                            helperText="Please enter your description"
                            onChange={(e) => setAssetDesc(e.target.value)}
                            value={assetDesc}

                            required
                        />

                    </Row>
                    <Row css={{ padding: "30px 0" }} justify="center">
                        <Input
                            underlined
                            size="lg"
                            label="NFT Image"
                            color="#7928ca"
                            type="file"
                            helperText="Please enter file"
                            name="image" 
                            required
                            onChange={(e) => setImage(e.target.files[0])}
                            />
                    </Row>
                    <Row css={{ padding: "30px 0" }} justify="center">
                        <Input
                            underlined
                            size="lg"
                            label="NFT Video"
                            color="#7928ca"
                            type="file"
                            helperText="Please enter file"
                            name="file" 
                            required
                            onChange={(e) => setFile(e.target.files[0])}
                            />
                    </Row>
                    
                    <Row css={{ padding: "30px 0" }} justify="center">
                        {isLoading ?
                            <Button disabled>
                                <Loading color="currentColor" size="sm" />
                            </Button>
                            :
                            <Button color={"success"} type="submit">Create Item</Button>
                        }
                    </Row>
                </form>
            </Container>
        </>
    )
}