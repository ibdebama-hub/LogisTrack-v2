export interface PublicApiCampaignPayload {
  id: string;
  reference: string;
  name: string;
  status: string;
  total_missions: number;
  delivered_missions: number;
  success_rate: number;
}

export interface PublicApiMissionPayload {
  id: string;
  tracking_number: string;
  recipient_name: string;
  address: string;
  status: string;
  pod_certified: boolean;
  cod_amount: number;
}

export function mapToPublicCampaign(campaign: any): PublicApiCampaignPayload {
  return {
    id: campaign.id,
    reference: campaign.reference_code || 'CAMP-2026',
    name: campaign.name,
    status: campaign.status,
    total_missions: campaign.total_items || 0,
    delivered_missions: campaign.delivered_items || 0,
    success_rate: campaign.total_items > 0 ? (campaign.delivered_items / campaign.total_items) * 100 : 0
  };
}

export function mapToPublicMission(item: any): PublicApiMissionPayload {
  return {
    id: item.id,
    tracking_number: item.tracking_number,
    recipient_name: item.recipient_name,
    address: item.address_raw,
    status: item.status,
    pod_certified: item.status === 'delivered',
    cod_amount: Number(item.cod_amount) || 0
  };
}
