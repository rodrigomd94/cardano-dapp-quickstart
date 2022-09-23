
import { useState } from 'react'
import { useStoreActions, useStoreState } from "../utils/store";


const NftCard = (props: any) => {
    const image = typeof (props.meta.image) === 'string' ? "https://ipfs.io/ipfs/" + props.meta.image.replace("ipfs://", "") : ""

    return (
        <>
            <div className="card w-76 bg-base-300 shadow-xl m-5">
                <figure className="px-10 pt-10">
                    <img src={image} alt="Shoes" className="rounded-xl" />
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title">{props.meta.name}</h2>
                    <div className="card-actions">
                    </div>
                </div>
            </div>
        </>
    )
}

export default NftCard;