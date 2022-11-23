
import { useState, useEffect } from 'react'
import { Container, Input, Row, Button, Loading ,Progress} from "@nextui-org/react"
import Navigation from "../components/Navigation"
import { ethers } from 'ethers'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import StreamxFactory from '../contracts/StreamxFactory.json'
import { videonft } from '@livepeer/video-nft'
import { NFTStorage, File, Blob } from 'nft.storage'
import { TagsInput } from "react-tag-input-component"; 

export default function MyNfts() {
    const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
    const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT;

    const [isLoading, setIsLoading] = useState(false)
    const [fileUrl, setFileUrl] = useState("")
    const router = useRouter()
    const [thumbnail, setFile] = useState("");
    const [images, setImage] = useState("");
    const [categories , setCategories] =useState([]);
    const [description, setDescription] = useState();    
    const [name ,setName] = useState();
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
    const createAccount = async (e) => {
        e.preventDefault()
        setIsLoading(true)

            const thumbnails = new Blob([thumbnail]);
            const profileimage = new Blob([images])
            let streamername = name;
            let streamerdesc = description;
            let streamerImages = [await client.storeBlob(profileimage)];
            let streamerCategories = categories;
            let streamerthumbnail = await client.storeBlob(thumbnails);
            
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            let contract = new ethers.Contract(CONTRACT, StreamxFactory.abi, signer)
            try {
                const tx =  await contract.createStreamer(streamername,streamerthumbnail,streamerImages,streamerCategories,streamerdesc)

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
        async function pushprofile(){
        if(profile===false){
            Swal.fire({
                title: 'Success',
                html: `You Already have a account`,
                icon: 'success',
                confirmButtonText: 'Done',
            }).then(
                router.push('/')
            )
        }else{
            return ;
        }
        }
        console.log(profile)
    useEffect(() => {
        checkForWallet()
        checkProfile()
        pushprofile()
    }, [profile])

    return (
        <>
       
            <div>
                <Navigation />
            </div>
            <Container>
                <form onSubmit={createAccount}>
                    <Row css={{ padding: "30px 0" }} justify="center" align="center">
                        <Input
                            size="lg"
                            bordered
                            name="name"
                            label="Name"
                            color="#7928ca"
                            helperText="Please enter NFT name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
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
                    <TagsInput
                        label="Select Categories"
                        value={categories}
                        onChange={setCategories}
                        name="categories"
                        placeHolder="categories"
                    />                    
                    </Row>
                    <Row css={{ padding: "30px 0" }} justify="center">
                        <Input
                            underlined
                            size="lg"
                            label="Profile Image"
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
                            label="Thumbnail Image"
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
                            <Button color={"success"} type="submit">Create Profile</Button>
                        }
                    </Row>
                </form>
            </Container>
        </>
    )
}