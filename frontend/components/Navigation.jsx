import { useEffect } from "react"
import { ethers } from "ethers"
import { useState } from "react"
import { Button, Row, Text, Col, Grid, Image } from "@nextui-org/react"
import Link from 'next/link'
import Swal from 'sweetalert2'
import StreamxFactory from '../contracts/StreamxFactory.json'
import { useRouter } from 'next/router'
import Streamx from '../contracts/Streamx.json'

export default function Navigation() {
    const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT;

    const router = useRouter()
    const [address, setAddress] = useState()
    const [isConnected, setIsConnected] = useState(false)
    const [profile,setProfile] = useState();
    const [streamstatus,setStreamstatus] = useState(false);
    const [mycontract,setMycontract] = useState("")

    async function askToChangeNetwork() {
        if (window.ethereum) {
            const targetNetworkId = '0x1313161555';
            const chainId = 1313161555;
            if (window.ethereum.networkVersion != chainId) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: targetNetworkId }],
                    });
                } catch (error) {
                    if (error.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: targetNetworkId,
                                        rpcUrl: 'https://testnet.aurora.dev/',
                                    },
                                ],
                            });
                        } catch (addError) {
                            console.error(addError);
                        }
                    }
                    console.error(error);
                }
            }
        } else {
            alert('MetaMask is not installed');
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
                text: "Connect Wallet",
                icon: 'error',
                confirmButtonText: 'close',
            }).then(() => {
                router.push('/')
            })
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
    async function fetchContract(){
        if(profile===false){        
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
                text: "Connect Wallets",
                icon: 'error',
                confirmButtonText: 'close',
            }).then(() => {
                router.push('/')
            })
        }}

    }
    async function onChainChange() {
        if (window.ethereum) {
            await window.ethereum.on('chainChanged', chainId => {
                askToChangeNetwork()
                window.location.reload();
            })
        }
    }

    async function onAccountChange() {
        await window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload();
        });
    }
    
    async function checkForConnection() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const accountAddress = await signer.getAddress()
        accountAddress ? setIsConnected(true) : setIsConnected(false)
        if(accountAddress){
            checkProfile()
        } 
    }

    useEffect(() => {
        onChainChange()
        askToChangeNetwork()
        onAccountChange()
        checkForConnection()
        fetchContract()
        checkStreamStatus()
    }, [mycontract])

    async function connectWallet() {
        if (typeof window !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = provider.getSigner()
            const accountAddress = await signer.getAddress()
            setAddress(accountAddress)
            accountAddress ? setIsConnected(true) : setIsConnected(false)
        } else {
            alert("please Install metamask")
        }
    }
    return (
        <>
            <Row css={{ backgroundColor: "#220760", padding: "10px 0", marginBottom: "30px" }} justify="center" align="center">
                <Col span={1}>
                </Col>
                <Col span={3}>
                    <Text color="white" h2 size={15} css={{ m: 0 }}>
                        <Link color="white" href="/">Streamx</Link>
                    </Text>
                </Col>
                <Col span={8}>
                    <Grid.Container css={{ display: "flex", alignItems: "center" }} justify="center" alignContent="center">
                        <Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/">Home</Link>
                            </Text>
                        </Grid>
                        {profile===false?
                        <>
                        <Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/mynfts">Own Videos</Link>
                            </Text>
                        </Grid>
                        <Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/createitem">Create Video</Link>
                            </Text>
                        </Grid>{streamstatus===false ?
                        <Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/createstream">Create Stream</Link>
                            </Text>
                        </Grid>:<Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/viewstream">View Stream Details</Link>
                            </Text>
                        </Grid>}</>
                        
                        :
                        <Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/createaccount">Create Account</Link>
                            </Text>
                        </Grid>
                        }
                        <Grid xs={2}>
                            {isConnected ?
                                <Button disabled
                                >
                                
                                    <Image
                                        width={20}
                                        src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"/>
                                    <Text>Connected</Text>
                                </Button>
                                :
                                <Button
                                    size={"sm"} color={"success"} onClick={connectWallet}>
                                    <Image
                                        width={20}
                                        src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"/>
                                    <Text>Connect</Text>
                                </Button>
                            }
                        </Grid>
                    </Grid.Container>
                </Col>
            </Row>
        </>
    )
}
