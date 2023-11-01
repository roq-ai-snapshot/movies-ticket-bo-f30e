interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Administrator'],
  customerRoles: ['Customer'],
  tenantRoles: ['Owner', 'Administrator', 'Customer Service Representative'],
  tenantName: 'Organization',
  applicationName: 'Movies Ticket Booking Online',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: ['Read movie information', 'Read show timings', 'Book a show', 'Manage personal user information'],
  ownerAbilities: [
    'Manage users',
    'Manage organizations',
    'Manage movies',
    'Manage theaters',
    'Manage shows',
    'Manage bookings',
  ],
  getQuoteUrl: 'https://app.roq.ai/proposal/1faa559f-b512-40e4-8a39-7fb6a3b40a63',
};
