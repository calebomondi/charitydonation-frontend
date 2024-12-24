export interface CreateCampaignArgs {
    title: string
    description: string
    target: string // In ETH
    durationDays: number
}

export interface CampaignCreatedEvent {
    campaign_id: bigint
    campaignAddress: string
    title: string
    targetAmount: bigint
    deadline: bigint
}