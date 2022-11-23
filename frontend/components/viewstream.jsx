import { useEffect, useState } from "react"
import { Card, Col, Row, Button, Text, Modal, Input, Loading,Link, Container } from "@nextui-org/react"
import { ethers } from "ethers"
import StreamxFactory from '../contracts/StreamxFactory.json'
import Streamx from '../contracts/Streamx.json'
import Swal from 'sweetalert2'


import { useRouter } from 'next/router'
import  axios from "axios"

export default function ViewStream( ) {
    const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT;

    const live_peer = process.env.NEXT_PUBLIC_LIVE_PEER

    const router = useRouter()
    const [name ,setName] = useState();
    const [playback ,setPlayback] = useState();
    const [streamkey, setStreamKey] = useState();
    const [streamstatus,setStreamstatus] = useState();
    const [mycontract,setMycontract] = useState("")
    const [streamid,setStreamid] = useState()
    const [isLoading, setIsLoading] = useState(false)

    async function fetchstream(streamidd){
           
            var config = {
            method: 'get',
            url: `https://livepeer.studio/api/stream/${streamidd}`,
            headers: { 
                'authorization': `Bearer ${live_peer}`
            }
            };

           const data =  await axios(config)
           console.log(data)
            setName(data.data.name)
            setPlayback(data.data.playbackId)
            setStreamKey(data.data.streamKey)
        
    }
    async function deletestream(){
           
        var config = {
        method: 'delete',
        url: `https://livepeer.studio/api/stream/${streamid}`,
        headers: { 
            'authorization': `Bearer ${live_peer}`
        }
        };

        await axios(config)
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const walletAddress = await signer.getAddress()
        let contract = new ethers.Contract(mycontract, Streamx.abi, signer)
            try {
                const tx =  await contract.streamURIupdate(false,"","")

                await tx.wait()
                Swal.fire({
                    title: 'Success',
                    html: `Your Stream Has Been deleted `,
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
    async function checkStreamStatus(){
        if(mycontract!==""){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            let contract = new ethers.Contract(mycontract, Streamx.abi, signer)
            let contractornot = await contract.streamstatus()
            setStreamstatus(contractornot)
            }catch(err){
            Swal.fire({
                title: 'Error',
                text: "Connect Wallet",
                icon: 'error',
                confirmButtonText: 'close',
            }).then(() => {
                router.push('/')
            })
        }}else{
            return ;
        }
    } 
    async function checkStreamid(){
        if(mycontract!==""){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            let contract = new ethers.Contract(mycontract, Streamx.abi, signer)
            let contractornot = await contract.streamUri()
            setStreamid(contractornot)
            await fetchstream(contractornot);
            }catch(err){
            Swal.fire({
                title: 'Error',
                text: "Connect Wallet",
                icon: 'error',
                confirmButtonText: 'close',
            }).then(() => {
                router.push('/')
            })
        }}else{
            return ;
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
    async function pushprofile(){
        if(streamstatus===false){
            Swal.fire({
                title: 'error',
                html: `You Don't have Any streams`,
                icon: 'error',
                confirmButtonText: 'Done',
            }).then(
                router.push('/')
            )
        }else{
            return ;
        }
        }
    useEffect(() => {
        fetchContract()
        checkStreamStatus()
        checkStreamid()
        pushprofile()
    }, [mycontract,streamstatus])

    

    return (
        <>{name?
            <Container>
                <h1>Stream Details</h1>
                <h3>Stream ID : {streamid}</h3>
                <h3>Stream Name : {name}</h3>
                <h3>Stream Playback id : {playback}</h3>
                <h3>Stream Key : {streamkey}</h3>
                {isLoading ?
                            <Button disabled>
                                <Loading color="currentColor" size="sm" />
                            </Button>
                            :
                <Button color={"success"} onClick={deletestream}>
                Delete Stream
            </Button>}
            </Container>
           
: <Loading/>}
           
        </>
    )
}
