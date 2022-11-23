
import { useState, useEffect } from 'react'
import { Container, Input, Row, Button, Loading ,Progress} from "@nextui-org/react"
import Navigation from "../components/Navigation"
import { ethers } from 'ethers'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import StreamxFactory from '../contracts/StreamxFactory.json'
import Streamx from '../contracts/Streamx.json'

import axios from 'axios'
export default function MyNfts() {
    const live_peer = process.env.NEXT_PUBLIC_LIVE_PEER
    const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT
    const [isLoading, setIsLoading] = useState(false)
    const [mycontract,setMycontract] = useState("")

    const router = useRouter()
    const [description, setDescription] = useState();
    const [streamname ,setName] = useState();
    const [profile,setProfile] = useState(true);
    
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
    async function checkProfile(){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            let contract = new ethers.Contract(CONTRACT, StreamxFactory.abi, signer)
            let contractornot = await contract.checkstatus(walletAddress)
            setProfile(contractornot)
            }catch(err){
            Swal.fire({
                title: 'Error',
                text: err.message,
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
            //setAllItems(items)
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
    const createStream = async (e) => {
        e.preventDefault()
        setIsLoading(true)

            
            let streamnames = streamname;
            let streamdesc = description;

            const streamuri = await axios.post('https://livepeer.studio/api/stream',{
                "name": streamnames,
                "profiles": [
                  {
                    "name": "720p",
                    "bitrate": 2000000,
                    "fps": 0,
                    "width": 1280,
                    "height": 720
                  },
                  {
                    "name": "480p",
                    "bitrate": 1000000,
                    "fps": 0,
                    "width": 854,
                    "height": 480
                  },
                  {
                    "name": "360p",
                    "bitrate": 500000,
                    "fps": 0,
                    "width": 640,
                    "height": 360
                  }
                ]
              },
              {
                headers: {
                    'authorization': `Bearer ${live_peer}`,
                    'content-type': 'application/json'
                }})
                console.log(streamuri.data.id)
            let streamUri = streamuri.data.id
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            let contract = new ethers.Contract(mycontract, Streamx.abi, signer)
            try {
                const tx =  await contract.streamURIupdate(true,streamUri,streamdesc)

                await tx.wait()
                Swal.fire({
                    title: 'Success',
                    html: `Your Stream Has Been Created.<br> Your SteamKey is ${streamuri.data.streamKey}</br>
                    Your Stream Url is rtmp://rtmp.livepeer.com/live</br>
                    Please Note Your StreamKey Somewhere it will be lost after closing this page.`,
                    icon: 'Success',
                    confirmButtonText: 'Done',
                })
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
        
        console.log(profile)
    useEffect(() => {
        checkForWallet()
        checkProfile()
        fetchContract()
    }, [profile])

    return (
        <>
       
            <div>
                <Navigation />
            </div>
            <Container>
                <form onSubmit={createStream}>
                    <Row css={{ padding: "30px 0" }} justify="center" align="center">
                        <Input
                            size="lg"
                            bordered
                            name="name"
                            label="Name"
                            color="#7928ca"
                            helperText="Please enter NFT name"
                            onChange={(e) => setName(e.target.value)}
                            value={streamname}
                            required
                        />
                    </Row>
                    <Row css={{ padding: "30px 0" }} justify="center">
                        <Input
                            size="lg"
                            bordered
                            name="desc"
                            color="#7928ca"
                            label="Steamer description"
                            helperText="Please enter your description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}

                            required
                        />

                    </Row>
                   
                    
                    <Row css={{ padding: "30px 0" }} justify="center">
                        {isLoading ?
                            <Button disabled>
                                <Loading color="currentColor" size="sm" />
                            </Button>
                            :
                            <Button color={"success"} type="submit">Create Stream</Button>
                        }
                    </Row>
                </form>
            </Container>
        </>
    )
}