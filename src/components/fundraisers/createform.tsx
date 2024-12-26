import { useState } from 'react'
import { useCreateCampaign } from '../../blockchain-services/hooks/useCharityDonation'

const CreateCampaignForm = () => {
  const { 
    handleCreateCampaign,
    isError,
    isSuccess,
    isPending,
    campaignCreated,
    campaignCreatedData,
    error
   } = useCreateCampaign()

   const handleUpdate = () => {
    handleCreateCampaign({
      title: 'Test Campaign 003',
      description: 'This is a test campaign',
      target: '1',
      durationDays: '11'
    })
   }
  
  return (
    <div>
      <button onClick={() => handleUpdate()} disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Campaign'}
      </button>

      {isError && <div>Error: {error}</div>}
      {isSuccess && <div>Campaign created!</div>}
      {campaignCreated && campaignCreatedData && (
        <div>
          <h2>Campaign created!</h2>
          <p>Campaign ID: {campaignCreatedData.campaign_id}</p>
          <p>Campaign Address: {campaignCreatedData.campaignAddress}</p>
          <p>Title: {campaignCreatedData.title}</p>
          <p>Target Amount: {campaignCreatedData.targetAmount}</p>
          <p>Deadline: {campaignCreatedData.deadline}</p>
        </div>
      )}
    </div>
  )
}

export default CreateCampaignForm