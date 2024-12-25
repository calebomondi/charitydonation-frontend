import { useCreateCampaign } from '../../blockchain-services/hooks/useCharityDonation'
import { useState } from 'react'

export function CreateCampaignForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    durationDays: ''
  })

  const { 
    createCampaign, 
    isLoading, 
    isSuccess, 
    transactionHash,
    error,
    isEventReceived,
    campaignData
  } = useCreateCampaign()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createCampaign({
        title: formData.title,
        description: formData.description,
        target: formData.target,
        durationDays: parseInt(formData.durationDays)
      })
    } catch (error) {
      console.error('Failed to create campaign:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Campaign</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Campaign Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="target" className="block mb-1">Target Amount (ETH)</label>
          <input
            id="target"
            name="target"
            type="number"
            step="0.01"
            value={formData.target}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="durationDays" className="block mb-1">Duration (Days)</label>
          <input
            id="durationDays"
            name="durationDays"
            type="number"
            value={formData.durationDays}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error.message}
        </div>
      )}

      {isSuccess && isEventReceived && campaignData && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <h3 className="font-bold">Campaign Created Successfully!</h3>
          <div className="mt-2">
            <p>Campaign: {campaignData.campaignId}</p>
            <p>Title: {campaignData.title}</p>
            <p>Target Amount: {campaignData.targetAmount} ETH</p>
            <p>Deadline: {campaignData.deadline}</p>
          </div>
        </div>
      )}
      {isSuccess && (
        <div>
          <p>Transanction Hash : {transactionHash}</p>
        </div>
      )}
    </div>
  )
}