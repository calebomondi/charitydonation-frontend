import { useViewCampaigns } from "../../blockchain-services/hooks/useCharityDonation"


export default function ViewMyCampaigns() {
    const { campaigns, isError, isLoading } = useViewCampaigns()
    
    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error fetching campaigns</p>

  return (
    <div className="">
      {campaigns.map((campaign) => (
        <div key={campaign.campaign_id}>
          <h2>{campaign.title}</h2>
          <p>{campaign.description}</p>
          <div>Target: {campaign.targetAmount}</div>
          <div>Raised: {campaign.raisedAmount}</div>
          <div>Deadline: {campaign.deadline}</div>
        </div>
      ))}
    </div>
  )
}
