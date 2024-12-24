import { 
  useWriteContract, 
  useTransaction, 
  useWatchContractEvent,
  usePublicClient
} from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useState } from 'react'

import { CreateCampaignArgs, CampaignCreatedEvent } from "../../types";

import charityABI from "../abi/CharityDonation.json";

const CONTRACT_ADDRESS = '0x133818926101eEE247B1188fcE4a13f993d9c6E8'

export function useCreateCampaign() {
  const [campaignCreatedEvent, setCampaignCreatedEvent] = useState<CampaignCreatedEvent | null>(null)
  const [isEventReceived, setIsEventReceived] = useState(false)
  const publicClient = usePublicClient()

  // Write contract hook
  const { 
    writeContract: createCampaign,
    data: hash,
    isPending: isCreatePending,
    error: createError,
    reset: resetWrite
  } = useWriteContract()

  // Transaction hook
  const {
    isLoading: isWaitingForTransaction,
    isSuccess: isCreateSuccess,
    error: waitError,
  } = useTransaction({
    hash,
  })

  // Watch for CampaignCreated events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: charityABI.abi,
    eventName: 'CampaignCreated',
    onLogs(logs) {
      // Parse the event data from the log topics and data
      const log = logs[0]
      if (!log || !log.topics || !log.data) return
      
      // Decode the event data using your contract ABI
      const event = {
        campaign_id: BigInt(log.topics[1] || '0'),
        campaignAddress: log.topics[2] || '',
        title: log.data, // You might need to decode this properly based on your ABI
        targetAmount: BigInt(log.topics[3] || '0'),
        deadline: BigInt(log.topics[4] || '0')
      } as CampaignCreatedEvent
      
      setCampaignCreatedEvent(event)
      setIsEventReceived(true)
    },
  })

  // Reset states
  const reset = () => {
    resetWrite?.()
    setCampaignCreatedEvent(null)
    setIsEventReceived(false)
  }

  // Format campaign data for display
  const getFormattedCampaignData = () => {
    if (!campaignCreatedEvent) return null

    const deadline = new Date(Number(campaignCreatedEvent.deadline) * 1000)
    
    return {
      campaignId: Number(campaignCreatedEvent.campaign_id),
      creator: campaignCreatedEvent.campaignAddress,
      title: campaignCreatedEvent.title,
      targetAmount: formatEther(campaignCreatedEvent.targetAmount),
      deadline: deadline.toLocaleString(),
      deadlineTimestamp: Number(campaignCreatedEvent.deadline)
    }
  }

  // Get transaction receipt
  const getTransactionReceipt = async () => {
    if (!hash) return null
    
    const receipt = await publicClient.getTransactionReceipt({
      hash,
    })
    
    return receipt
  }

  const handleCreateCampaign = async ({
    title,
    description,
    target,
    durationDays
  }: CreateCampaignArgs) => {
    try {
      // Input validation
      if (!title.trim()) throw new Error('Title is required')
      if (!description.trim()) throw new Error('Description is required')
      if (isNaN(Number(target)) || Number(target) <= 0) throw new Error('Invalid target amount')
      if (!Number.isInteger(durationDays) || durationDays <= 0) throw new Error('Invalid duration')

      // Convert target from ETH to Wei
      const targetInWei = parseEther(target)
      
      await createCampaign({
        address: CONTRACT_ADDRESS,
        abi: charityABI.abi,
        functionName: 'createCampaign',
        args: [
          title,
          description,
          targetInWei,
          BigInt(durationDays)
        ],
      })
    } catch (error) {
      console.error('Error creating campaign:', error)
      throw error
    }
  }

  return {
    createCampaign: handleCreateCampaign,
    isLoading: isCreatePending || isWaitingForTransaction,
    isSuccess: isCreateSuccess,
    isEventReceived,
    error: createError || waitError,
    transactionHash: hash,
    campaignData: getFormattedCampaignData(),
    reset,
    getTransactionReceipt
  }
}