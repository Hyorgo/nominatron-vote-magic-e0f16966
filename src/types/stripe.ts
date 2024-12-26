export interface StripeSettings {
  stripe_price_id: string;
  stripe_success_url: string;
  stripe_cancel_url: string;
  stripe_dashboard_url: string;
  stripe_price_ht: string;
  stripe_price_ttc: string;
  stripe_connection_status: string;
}

export const defaultStripeSettings: StripeSettings = {
  stripe_price_id: '',
  stripe_success_url: '',
  stripe_cancel_url: '',
  stripe_dashboard_url: '',
  stripe_price_ht: '',
  stripe_price_ttc: '',
  stripe_connection_status: 'disconnected',
};