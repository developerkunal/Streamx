import { useEffect, useState } from "react"
import { ethers } from 'ethers'
import { Grid, Loading } from "@nextui-org/react"
import Videoscard from "./Videoscard"
import StreamxFactory from '../../contracts/StreamxFactory.json'
import Streamx from '../../contracts/Streamx.json'
import Swal from "sweetalert2"


export default function Videos() {
    const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT;
    const [allItems, setAllItems] = useState([])
    async function fetchcontracts() {
       try{ const provider = new ethers.providers.Web3Provider(window.ethereum)
        let contract = new ethers.Contract(CONTRACT, StreamxFactory.abi, provider)
        let number = await contract.currentId()
        const items = [];
        const owners= [];
        for(let i=0;i<number;i++){
          const contracts = await contract.items(i)
          items.push(contracts[2]) 
          owners.push(contracts[1])
        }
         
        items.map(async(item)=>{
          let nftss=[]
          const itemss =await getContractNfts(item)
          itemss.map(async(item)=>{
            nftss.push(item)
          })

          setAllItems(nftss)
       })

      }catch(e){
        console.log(e)
       }
      }
    async function getContractNfts(item) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
          let contract = new ethers.Contract(item, Streamx.abi, provider)
          let owner = await contract.owner() 
          let number = await contract.balanceOf(owner);
          let nftss=[];
          for(let i=0;i<number;i++){
              let nft = await contract.tokenURI(i);
              nftss.push(nft)
          } 
          return nftss;
        } catch (err) { 
          console.log(err)
      }
  }
    useEffect(() => {
      if(allItems.length == 0){
        fetchcontracts()
      }
    }, [])

 
    return (
        <> <center><h1>All Videos</h1></center>
            <Grid.Container gap={2} justify="center"> 
               
                {allItems.length > 0 ? allItems?.map((items,i) =>
                        <Grid key={i} xs={12} sm={4} md={3}>
                            <Videoscard id={items}/>
                        </Grid>
                ): <Loading />}
            </Grid.Container>
        </>
    )
}
