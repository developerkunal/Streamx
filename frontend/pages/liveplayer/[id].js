import Image from 'next/image';
import { useRouter } from 'next/router';
import logo from '../../public/vercel.svg';
import { Player } from '@livepeer/react';
import styles from '../../styles/Asset.module.css';
import Navigation from "../../components/Navigation"

// Calling the api from server side using 'getServerSideProps' and passing in existing
// routes from 'getStaticPaths' for dynamic routing
export async function getServerSideProps({ params }) {
    const live_peer = process.env.NEXT_PUBLIC_LIVE_PEER

  const [assetRes] = await Promise.all([
    fetch(`https://livepeer.studio/api/stream/${params.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${live_peer}`,
        'Content-Type': 'application/json',
      },
    }),


  ]);
    
  // Convert json response into JS object
  const [ assets ] = await Promise.all( [
    assetRes.json(),
  ] )
  
  // Assign api responses as props to be available to passed
  return {
    props: {
      assets,
    },
  };
}


// Function to display each asset with their own information
export default function AssetDetails({ assets }) {
  // Accessing the 'query' from the router object to passing in the id of each asset for dynamic routing
  const {
    query: { id },
  } = useRouter();

  console.log(assets.isActive)

  return (
    <div>
        <Navigation/>
      <div className={styles.card} key={id}>
        {/* Display embedded Video Player if it exists, otherwise show an image */}
        {assets.isActive ? (
              <a>
                <Player
                  playbackId={`${assets.playbackId}`}
                  autoPlay={false}
                  width={200}
                  loop
                  muted
                />
                <p>Stream Status:</p>
                <p className={styles.ready}>Live Now!</p>
                <p> {assets.name} </p>
              </a>
            ) : (
              <a>
                <Image src={logo} alt='Livepeer Studio Logo' width='50' height='50' />
                <h2> {assets.name} </h2>
                <p>Stream Status:</p>
                <p className={styles.failed}>Not Live</p>
              </a>
            )}
      </div>
    </div>
  );
}