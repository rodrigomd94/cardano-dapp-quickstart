
import { useEffect } from 'react'
import NftCard from './NftCard'

const NftGrid = (props : any) => {
    useEffect(()=>{
console.log(props)
    },[props])
    return (
        <>
        <div className="grid grid-cols-4 gap-2">
                {props.nfts.map((nft : any, index : Number) => {
                    return <NftCard key={index} meta={nft} />
                })}
            </div>
        </>

    )
}

export default NftGrid;