import { useEffect, useState } from "react"
import { ethers } from 'ethers'
import { Grid } from "@nextui-org/react"
import NftSingleCard from "./NftSingleCard"
import StreamxFactory from '../../contracts/StreamxFactory.json'
import Streamx from '../../contracts/Streamx.json'
import Swal from "sweetalert2"


export default function NftGrid() {

    const [allItems, setAllItems] = useState([])
    const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT;

    async function fetchNfts() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        let contract = new ethers.Contract(CONTRACT, StreamxFactory.abi, provider)
        let items = await contract.streamers(10,0)
        setAllItems(items)
        //console.log(items)
    }
    
    useEffect(() => {
        fetchNfts()
    }, [])


    return (
        <> <center><h1>All Streamers</h1></center>
            <Grid.Container gap={2} justify="center">
               
                {allItems.map((items, i) =>
                    items.itemId != 0 ?
                        <Grid key={i} xs={12} sm={4} md={3}>
                            <NftSingleCard id={(items)} />
                        </Grid>
                    : ""
                )}
            </Grid.Container>
        </>
    )
}
