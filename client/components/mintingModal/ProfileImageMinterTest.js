import { useState, useContext } from 'react'
import { TwitterContext } from '../../context/TwitterContext'
import { useRouter } from 'next/router'
import { client } from '../../lib/client'
import { contractABI, contractAddress } from '../../lib/constants'
import { ethers } from 'ethers'
import InitialState from './InitialState'
import LoadingState from './LoadingState'
import FinishedState from './FinishedState'
import { pinJSONToIPFS, pinFileToIPFS } from '../../lib/pinata'

let metamask

if (typeof window !== 'undefined') {
    metamask = window.ethereum
}

const getEthereumContract = () => {
    if (!metamask) return
    const provider = new ethers.providers.Web3Provider(metamask)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
    )

    return transactionContract
}


const ProfileImageMinter = () => {
    const [status, setStatus] = useState('initial');
    const { currentAccount, setAppStatus } = useContext(TwitterContext);
    const router = useRouter()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [profileImage, setProfileImage] = useState();

    const mint = async () => {
        if (!name || !description || !profileImage) return
        setStatus('loading')

        const pinataMetadata = {
            name: `${name} - ${description}`,
        }

        const ipfsImageHash = await pinFileToIPFS(profileImage, pinataMetadata)

        await client.patch(currentAccount)
            .set({ profileImage: ipfsImageHash })
            .set({ isProfileImageNft: true })
            .commit()

        const imageMetadata = {
            name: name,
            description: description,
            image: `ipfs://${ipfsImageHash}`
        }

        const ipfsJsonHash = await pinJSONToIPFS(imageMetadata, pinataMetadata)

        const contract = await getEthereumContract()

        const transactionParameters = {
            to: contractAddress,
            from: currentAccount,
            data: await contract.mint(currentAccount, `ipfs://${ipfsJsonHash}`),
        }

        try {
            await metamask.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            })

            setStatus('finished')
        } catch (error) {
            console.log("The Error Of MINT Is : ", error)
            setStatus('finished')
        }

    }

    const modalChildren = (modalStatus = status) => {
        switch (modalStatus) {
            case 'initial':
                return (
                    <InitialState
                        profileImage={profileImage}
                        setProfileImage={setProfileImage}
                        name={name}
                        setName={setName}
                        description={description}
                        setDescription={setDescription}
                        mint={mint}
                    />
                )
            case 'loading':
                return <LoadingState />

            case 'finished':
                <FinishedState />

            default:
                router.push('/')
                setAppStatus('error')
                break
        }
    }

    return (
        <div>
            {modalChildren()}
        </div>
    )
}

export default ProfileImageMinter