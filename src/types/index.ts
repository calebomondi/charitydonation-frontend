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

export interface CampaignDataArgs {
    campaign_id: bigint;
    title: string;
    description: string;
    campaignAddress: string;
    targetAmount: bigint;
    raisedAmount: bigint;
    balance: bigint;
    deadline: bigint;
    isCompleted: boolean;
    isCancelled: boolean;
}