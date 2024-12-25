import { 
  useWriteContract, 
  useReadContract,
  useTransaction, 
  useWatchContractEvent,
  usePublicClient,
  useAccount
} from 'wagmi'
import { parseEther, formatEther, decodeEventLog } from 'viem'
import { useState } from 'react'

import { CreateCampaignArgs, CampaignCreatedEvent, CampaignDataArgs } from "../../types";

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
      if (!logs.length) return;
  
      try {
        const log = logs[0]; // Assuming only one log is relevant here.
  
        // Decode the log data using viem
        const decodedLog = decodeEventLog({
          abi: charityABI.abi,
          eventName: 'CampaignCreated',
          data: log.data,
          topics: log.topics,
        });

        if (!decodedLog || !decodedLog.args) {
          throw new Error('Failed to decode log: args are undefined.');
        }
  
        const event = {
          campaign_id: Number(decodedLog.args[0]),
          campaignAddress: decodedLog.args[1],
          title: decodedLog.args[2],
          targetAmount: formatEther(decodedLog.args[3] as bigint),
          deadline: new Date(Number(decodedLog.args[4]) * 1000).toLocaleString(),
        } as unknown as CampaignCreatedEvent;
  
        console.log('Decoded Event:', event);
  
        setCampaignCreatedEvent(event);
        setIsEventReceived(true);
      } catch (error) {
        console.error('Error decoding event log:', error);
      }
    },
  });
  
  
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

export function useViewCampaigns() {
  const {address} = useAccount()

  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: charityABI.abi,
    functionName: 'viewCampaigns',
    account: address
  });

  console.log('Campaigns:', data)

  if (isError) {
    console.error('Error fetching campaigns:', data)
    throw new Error('Failed to fetch campaigns')
  }

  const campaigns = Array.isArray(data) 
  ? data.map((campaign: CampaignDataArgs) => ({
    campaign_id: Number(campaign.campaign_id),
    title: campaign.title,
    description: campaign.description,
    campaignAddress: campaign.campaignAddress,
    targetAmount: formatEther(campaign.targetAmount),
    raisedAmount: formatEther(campaign.raisedAmount),
    balance: formatEther(campaign.balance),
    deadline: new Date(Number(campaign.deadline) * 1000).toLocaleString(),
    isCompleted: campaign.isCompleted,
    isCancelled: campaign.isCancelled
  })) : [];

  return {
    campaigns,
    isError,
    isLoading
  }
}
