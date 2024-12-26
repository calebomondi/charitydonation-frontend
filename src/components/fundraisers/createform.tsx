import { useState } from 'react'
import { useCreateCampaign } from '../../blockchain-services/hooks/useCharityDonation'

const CreateCampaignForm = () => {
  const { handleCreateCampaign, campaignCreated, campaignCreatedData, error } = useCreateCampaign()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    durationDays: ''
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleCreateCampaign(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (campaignCreated && campaignCreatedData) {
    return (
      <div>
        <h2>Campaign Created Successfully!</h2>
        <p>Campaign ID: {campaignCreatedData.campaign_id}</p>
        <p>Title: {campaignCreatedData.title}</p>
        <p>Target Amount: {campaignCreatedData.targetAmount} ETH</p>
        <p>Deadline: {campaignCreatedData.deadline}</p>
        <p>Contract Address: {campaignCreatedData.campaignAddress}</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Create New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Campaign Title:</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter campaign title"
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your campaign"
            required
          />
        </div>

        <div>
          <label htmlFor="target">Target Amount (ETH):</label>
          <input
            id="target"
            name="target"
            type="number"
            step="0.01"
            value={formData.target}
            onChange={handleChange}
            placeholder="Enter target amount in ETH"
            required
          />
        </div>

        <div>
          <label htmlFor="durationDays">Duration (Days):</label>
          <input
            id="durationDays"
            name="durationDays"
            type="number"
            value={formData.durationDays}
            onChange={handleChange}
            placeholder="Enter campaign duration in days"
            required
            min="1"
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Create Campaign</button>
      </form>
    </div>
  )
}

export default CreateCampaignForm