import { useViewCampaigns } from "../../blockchain-services/hooks/useCharityDonation"
import { useEffect, useState } from "react"
import { CampaignDataArgs } from "../../types";

export default function ViewMyCampaigns() {
    const { getCampaigns } = useViewCampaigns()
    const [campaigns, setCampaigns] = useState<CampaignDataArgs[]>([]);

    useEffect(() => {
        async function fetchCampaigns() {
        const campaignsData = await getCampaigns();
        setCampaigns(campaignsData);
        }
        fetchCampaigns();
    }, [getCampaigns]);

  return (
    <div>
      {campaigns.map((campaign) => (
        <div key={campaign.campaignId}>
          <h2>{campaign.title}</h2>
          <p>{campaign.description}</p>
          <p>Target: {campaign.targetAmount.toString()}</p>
          <p>Deadline: {campaign.deadline}</p>
        </div>
      ))}
    </div>
  )
}
