import { useEffect, useState } from "react"
import { ethers } from 'ethers'
import { Grid, Row, Col, Text } from "@nextui-org/react"
import OwnedSingleCard from "./ChannelSingleCard"
import StreamxFactory from '../../contracts/StreamxFactory.json'
import Streamx from '../../contracts/Streamx.json'
import Swal from "sweetalert2"
import { useRouter } from 'next/router'


export default function Channel({id}) {
    
    const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT;

    const router = useRouter()
    const [allItems, setAllItems] = useState([])
    const [contractadd,setMycontract] = useState("")
    async function fetchNfts() {
        if(contractadd!==""){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            const nfts=[];
            let contract = new ethers.Contract(contractadd, Streamx.abi, signer)
            let totalItems = await contract.balanceOf(walletAddress)
            if(totalItems>0){
            for(let i=0;i<totalItems;i++){
            const nft=    await contract.tokenURI(i)
            nfts.push(nft);
            }}
            console.log(nfts);
            setAllItems(nfts);
        } catch(err){
            /* Swal.fire({
                title: 'Error',
                text: "Connect Wallet",
                icon: 'error',
                confirmButtonText: 'close',
            }).then(() => {
                router.push('/')
            }) */
            console.log(err);
        }
    }else{

    }
    }
    async function fetchContract(){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            let contract = new ethers.Contract(CONTRACT, StreamxFactory.abi, signer)
            let contractaddress = await contract.items(id)
            setMycontract(contractaddress[2])
            //setAllItems(items)
        }catch(err){
            Swal.fire({
                title: 'Error',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'close',
            })/* .then(() => {
                router.push('/')
            }) */
        }
    }
    useEffect(() => {
    fetchContract()
    fetchNfts()
    }, [ contractadd])


    return (
        <>
        {allItems.length > 0 ? 
            <Grid.Container gap={2} justify="center">
                {allItems.map((items, i) =>
                    items.itemId != 0 ?
                        <Grid key={i} xs={12} sm={4} md={3}>
                            <OwnedSingleCard id={items} />
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