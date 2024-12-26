import { 
  useWriteContract, 
  useReadContract,
  useTransaction, 
  useWatchContractEvent,
  usePublicClient,
  useAccount
} from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useState, useCallback } from 'react'

import { CreateCampaignArgs, CampaignCreatedEvent, CampaignDataArgs } from "../../types";

import {abi} from '../abi/abi'

const CONTRACT_ADDRESS = '0x133818926101eEE247B1188fcE4a13f993d9c6E8'

export function useViewCampaigns() {
  const {address} = useAccount()

  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
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

export function useCreateCampaign() {
  const { writeContract, isError, isSuccess, isPending } = useWriteContract()
  const [campaignCreated, setCampaignCreated] = useState<boolean>(false)
  const [campaignCreatedData, setCampaignCreatedData] = useState<CampaignCreatedEvent | null>(null)
  const [error, setError] = useState<string | null>(null)

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: abi,
    eventName: 'CampaignCreated',
    onLogs(logs) {

      console.log('New logs!', JSON.stringify(logs))

      if (!logs || logs.length === 0) {
        console.log('No logs')
        return
      }
      const args = (logs[0] as unknown as { args: any }).args
      const { campaign_id, campaignAddress, title, targetAmount, deadline } = args

      setCampaignCreated(true)
      setCampaignCreatedData({
        campaign_id: Number(campaign_id),
        campaignAddress,
        title,
        targetAmount: Number(formatEther(targetAmount)),
        deadline: new Date(Number(deadline) * 1000).toLocaleDateString()
      })
    },
  })

  const handleCreateCampaign = async ({title,description,target,durationDays} : CreateCampaignArgs) => {

    try {
      setError(null)

      if (!title || !description || !target || !durationDays) {
        throw new Error('All fields are required')
      }
  
      if (isNaN(Number(target)) || Number(target) <= 0) {
        throw new Error('Target must be a number and greater than 0')
      }
  
      if (isNaN(Number(durationDays)) || Number(durationDays) <= 0) {
        throw new Error('Duration must be a number and greater than 0')
      }
  
      const targetInWei = parseEther(target)

      // Wait for the transaction
      await writeContract({ 
        abi,
        address: CONTRACT_ADDRESS,
        functionName: 'createCampaign',
        args: [
          title,
          description,
          targetInWei,
          BigInt(durationDays)
        ],
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error creating campaign'
      setError(errorMessage)
      console.error('Error creating campaign:', errorMessage)
    }
  }

  return {
    handleCreateCampaign,
    isError,
    isSuccess,
    isPending,
    campaignCreated,
    campaignCreatedData,
    error
  }
}

