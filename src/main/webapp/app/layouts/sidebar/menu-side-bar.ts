import { ISidebarMenuModel } from './sidebar.model';

// developer menu
export const DEVELOPER_MENU: ISidebarMenuModel[] = [
  {
    name: 'Developer Area',
    iconname: 'stethoscope',
    children: [
      {
        name: 'Sample of Show Diagram State',
        iconname: 'minus',
        route: 'developer-area/show-diagram-state',
      },
    ],
  },
];

// Forbidden Menu
export const FORBIDDEN_MENU: ISidebarMenuModel[] = [
  {
    name: 'Options',
    iconname: 'stethoscope',
    children: [
      {
        name: 'Correction Application',
        iconname: 'minus',
        route: 'options/correction-application',
      },
      {
        name: 'Correction Appraisal',
        iconname: 'minus',
        route: 'options/correction-appraisal',
      },
    ],
  },
];

// Dashboard
export const DASHBOARD: ISidebarMenuModel[] = [
  {
    name: 'Dashboard',
    iconname: 'house',
    route: 'dashboard',
  },
];
export const APPRAISAL_MENU_ADMIN: ISidebarMenuModel[] = [
  {
    name: 'Master',
    iconname: 'database',
    children: [
      {
        name: 'Internal',
        iconname: 'minus',
        route: 'internal',
      },
      {
        name: 'Position Type',
        iconname: 'minus',
        route: 'position-type',
      },
      {
        name: 'Approval Structure',
        iconname: 'minus',
        route: 'position-reporting-structure',
      },
      {
        name: 'Employee',
        iconname: 'minus',
        route: 'employee',
      },
      {
        name: 'Partner KJPP',
        iconname: 'minus',
        route: 'partner-kjpp',
      },

      {
        name: 'Uom Conversion',
        iconname: 'minus',
        route: 'uom-conversion',
      },
      {
        name: 'Geo Boundary',
        iconname: 'minus',
        route: 'geo-boundary',
      },
      {
        name: 'Industry Limit Exposure Parameter',
        iconname: 'minus',
        route: 'industry-limit-exposure-parameter',
      },
      {
        name: 'Legal Lending Limit Type',
        iconname: 'minus',
        route: 'legal-lending-limit-parameter',
      },
      {
        name: 'Document Checklist',
        iconname: 'minus',
        route: 'document-type',
      },
      {
        name: 'Lending Program Parameter',
        iconname: 'minus',
        route: 'lending-program-parameter',
      },
      {
        name: 'List Of Value',
        iconname: 'minus',
        route: 'list-of-value-parameter',
      },
      {
        name: 'Product',
        iconname: 'minus',
        route: 'master-product-parameter',
      },
      {
        name: 'Product Category',
        iconname: 'minus',
        route: 'product-category',
      },
      {
        name: 'Collateral',
        iconname: 'minus',
        route: 'collateral-parameter',
      },
      {
        name: 'Compliance Checklist',
        iconname: 'minus',
        route: 'master-compliance-checklist',
      },
      {
        name: 'Credit Agreement Clausal',
        iconname: 'minus',
        route: 'master-credit-agreement-clausal',
      },
      {
        name: 'Company Type',
        iconname: 'minus',
        route: 'master-company-type',
      },
      {
        name: 'Financial Institution',
        iconname: 'minus',
        route: 'master-financial-institution',
      },
    ],
  },
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
      // {
      //   name: 'SLIK Checking',
      //   iconname: 'minus',
      //   route: '',
      // },
    ],
  },
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Request Appraisal',
        iconname: 'minus',
        route: 'collateral-appraisal',
      },
      {
        name: 'Appraisal Distribution External',
        iconname: 'minus',
        route: 'batch-apprisal',
      },
      {
        name: 'Appraisal Distribution Internal',
        iconname: 'minus',
        route: 'batch-apprisal/internal',
      },
      {
        name: 'Appraisal Process',
        iconname: 'minus',
        route: 'batch-apprisal/process',
      },
      {
        name: 'Appraisal Report Approval',
        iconname: 'minus',
        route: 'batch-apprisal/approval',
      },
      {
        name: 'Appraisal Result Inquiry',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
    ],
  },
  {
    name: 'Credit Proposal',
    iconname: 'arrow-trend-up',
    children: [
      {
        name: 'Credit Proposal',
        iconname: 'minus',
        route: 'credit-proposal-status',
      },
      {
        name: 'Credit Proposal Approval',
        iconname: 'minus',
        route: 'cp-status-approval',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis Distribution',
        iconname: 'minus',
        route: 'la-distribution',
      },
      {
        name: 'Loan Analysis',
        iconname: 'minus',
        route: 'la-analyst',
      },
      {
        name: 'Loan Analysis SME Credit Review Checker',
        iconname: 'minus',
        route: 'la-SME-CRC',
      },
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
      {
        name: 'DAR Finalization',
        iconname: 'minus',
        route: 'dar-final',
      },
      {
        name: 'Final DAR - Checker',
        iconname: 'minus',
        route: 'dar-checker',
      },
      {
        name: 'Loan Committee Approval',
        iconname: 'minus',
        route: 'loan-committee-approval',
      },
      {
        name: 'DAR Notification',
        iconname: 'minus',
        route: 'dar-notif',
      },
      {
        name: 'Compliance Checking Distribution',
        iconname: 'minus',
        route: 'cc-distribution',
      },
      {
        name: 'Compliance Checking',
        iconname: 'minus',
        route: 'cc-checking',
      },
      {
        name: 'Compliance Checking Review',
        iconname: 'minus',
        route: 'cc-review',
      },
      {
        name: 'Compliance Checking Inquiry',
        iconname: 'minus',
        route: 'cc-inquiry',
      },
      {
        name: 'Loan Analyst and Approval Monitoring',
        iconname: 'minus',
        route: 'loan-analys-and-approval-monitoring',
      },
      {
        name: 'DAR Revision',
        iconname: 'minus',
        route: 'dar-revision',
      },
      {
        name: 'DAR Revision Checker',
        iconname: 'minus',
        route: 'dar-revision-checker',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Distribution Offering Letter',
        iconname: 'minus',
        route: 'distribution',
      },
      {
        name: 'Finalize Offering Letter',
        iconname: 'minus',
        route: 'finalize',
      },
      {
        name: 'Offering Letter Review',
        iconname: 'minus',
        route: 'review',
      },
      {
        name: 'Offering Letter Confirmation',
        iconname: 'minus',
        route: 'confirmation',
      },
    ],
  },
  {
    name: 'Disbursement',
    iconname: 'suitcase',

    children: [
      {
        name: 'Request Disbursement',
        iconname: 'minus',
        route: '',
      },
      {
        name: 'Credit Administration',
        iconname: 'minus',
        route: '',
      },
    ],
  },
  {
    name: 'Perjanjian Kredit',
    iconname: 'suitcase',
    children: [
      {
        name: ' Finalize Perjanjian Kredit',
        iconname: 'minus',
        route: 'finalize-pk',
      },
      {
        name: ' Review Perjanjian Kredit',
        iconname: 'minus',
        route: 'review-pk',
      },
    ],
  },
  {
    name: 'Daftar Pengecekan Dokumen Legal',
    iconname: 'suitcase',
    children: [
      {
        name: ' Finalize DPDL',
        iconname: 'minus',
        route: 'finalize-dpdl',
      },
      {
        name: ' Review DPDL',
        iconname: 'minus',
        route: 'review-dpdl',
      },
    ],
  },

  {
    name: 'Daftar Pengecekan Pencairan Kredit',
    iconname: 'suitcase',
    children: [
      {
        name: ' finalize DPPK',
        iconname: 'minus',
        route: 'finalize-dppk',
      },
      {
        name: ' Review DPPK',
        iconname: 'minus',
        route: 'review-dppk',
      },
    ],
  },

  {
    name: 'DPPK Insurance',
    iconname: 'suitcase',
    children: [
      {
        name: ' Insurance Checking',
        iconname: 'minus',
        route: 'insurance-check',
      },
      {
        name: ' Insurance Review',
        iconname: 'minus',
        route: 'insurance-review',
      },
    ],
  },
  // {
  //   name: 'MIS Report',
  //   iconname: 'file-lines',
  //   route: '',
  // },
  {
    name: 'Configuration',
    iconname: 'wrench',
    children: [
      {
        name: 'Parameter',
        iconname: 'minus',
        route: 'application-option',
      },
      {
        name: 'Menu Access',
        iconname: 'minus',
        route: 'menu-access',
      },
      {
        name: 'Menu Permission',
        iconname: 'minus',
        route: 'menu-permission',
      },
    ],
  },
];

// seperated config
export const SLIK_MENU_BUSINESS_SUPPORT: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
    ],
  },
];

export const APPRAISAL_MENU_ADMIN_CONFIG: ISidebarMenuModel[] = [
  {
    name: 'MIS Report',
    iconname: 'file-lines',
    route: '',
  },
  // {
  //   name: 'Configuration',
  //   iconname: 'wrench',
  //   children: [
  //     {
  //       name: 'Parameter',
  //       iconname: 'minus',
  //       route: 'application-option',
  //     },
  //     {
  //       name: 'Menu Access',
  //       iconname: 'minus',
  //       route: 'menu-access',
  //     },
  //   ],
  // },
];

export const APPRAISAL_MENU_RM: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
    ],
  },
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Request Appraisal',
        iconname: 'minus',
        route: 'collateral-appraisal',
      },
      {
        name: 'Appraisal Result Inqury',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
    ],
  },
  {
    name: 'Credit Proposal',
    iconname: 'arrow-trend-up',
    children: [
      {
        name: 'Credit Proposal',
        iconname: 'minus',
        route: 'credit-proposal-status',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Offering Letter Confirmation',
        iconname: 'minus',
        route: 'confirmation',
      },
    ],
  },
];

export const APPRAISAL_MENU_SURVEYOR: ISidebarMenuModel[] = [
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Appraisal Process',
        iconname: 'minus',
        route: 'batch-apprisal/process',
      },
      {
        name: 'Appraisal Result Inquiry',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
    ],
  },
];

export const APPRAISAL_MENU_APPROVAL: ISidebarMenuModel[] = [
  {
    name: 'Master',
    iconname: 'house',
    children: [
      {
        name: 'Internal',
        iconname: 'minus',
        route: 'internal',
      },
      {
        name: 'Position Type',
        iconname: 'minus',
        route: 'position-type',
      },
      {
        name: 'Approval Structure',
        iconname: 'minus',
        route: 'position-reporting-structure',
      },
      {
        name: 'Employee',
        iconname: 'minus',
        route: 'employee',
      },
      {
        name: 'Partner KJPP',
        iconname: 'minus',
        route: 'partner-kjpp',
      },

      {
        name: 'Uom Conversion',
        iconname: 'minus',
        route: 'uom-conversion',
      },
      {
        name: 'Geo Boundary',
        iconname: 'minus',
        route: 'geo-boundary',
      },
      {
        name: 'Industry Limit Exposure Parameter',
        iconname: 'minus',
        route: 'industry-limit-exposure-parameter',
      },
      {
        name: 'Legal Lending Limit Type',
        iconname: 'minus',
        route: 'legal-lending-limit-parameter',
      },
      {
        name: 'Document Checklist',
        iconname: 'minus',
        route: 'document-type',
      },
      {
        name: 'Lending Program Parameter',
        iconname: 'minus',
        route: 'lending-program-parameter',
      },
      {
        name: 'List Of Value',
        iconname: 'minus',
        route: 'list-of-value-parameter',
      },
      {
        name: 'Product',
        iconname: 'minus',
        route: 'master-product-parameter',
      },
      {
        name: 'Collateral',
        iconname: 'minus',
        route: 'collateral-parameter',
      },
      {
        name: 'Compliance Checklist',
        iconname: 'minus',
        route: 'master-compliance-checklist',
      },
    ],
  },
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: '',
      },
    ],
  },
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Appraisal Report Approval',
        iconname: 'minus',
        route: 'batch-apprisal/approval',
      },
      {
        name: 'Appraisal Result Inqury',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
    ],
  },
  {
    name: 'Credit Proposal',
    iconname: 'arrow-trend-up',
    children: [
      {
        name: 'Credit Proposal',
        iconname: 'minus',
        route: 'credit-proposal-status',
      },
      {
        name: 'Credit Proposal Approval',
        iconname: 'minus',
        route: 'cp-status-approval',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis Distribution',
        iconname: 'minus',
        route: 'la-distribution',
      },
      {
        name: 'Loan Analysis',
        iconname: 'minus',
        route: 'la-analyst',
      },
      {
        name: 'Loan Analysis SME Credit Review Checker',
        iconname: 'minus',
        route: 'la-SME-CRC',
      },
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
      {
        name: 'DAR Finalization',
        iconname: 'minus',
        route: 'dar-final',
      },
      {
        name: 'Final DAR - Checker',
        iconname: 'minus',
        route: 'dar-checker',
      },
      {
        name: 'Loan Committee Approval',
        iconname: 'minus',
        route: 'loan-committee-approval',
      },
      {
        name: 'DAR Notification',
        iconname: 'minus',
        route: 'dar-notif',
      },
      {
        name: 'Compliance Checking Distribution',
        iconname: 'minus',
        route: 'cc-distribution',
      },
      {
        name: 'Compliance Checking',
        iconname: 'minus',
        route: 'cc-checking',
      },
      {
        name: 'Compliance Checking Review',
        iconname: 'minus',
        route: 'cc-review',
      },
      {
        name: 'Compliance Checking Inquiry',
        iconname: 'minus',
        route: 'cc-inquiry',
      },
      {
        name: 'Loan Analyst and Approval Monitoring',
        iconname: 'minus',
        route: 'loan-analys-and-approval-monitoring',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Distribution Offering Letter',
        iconname: 'minus',
        route: 'distribution',
      },
      {
        name: 'Finalize Offering Letter',
        iconname: 'minus',
        route: 'finalize',
      },
      {
        name: 'Offering Letter Review',
        iconname: 'minus',
        route: 'review',
      },
      {
        name: 'Offering Letter Confirmation',
        iconname: 'minus',
        route: 'confirmation',
      },
    ],
  },
  {
    name: 'Disbursement',
    iconname: 'suitcase',

    children: [
      {
        name: 'Request Disbursement',
        iconname: 'minus',
        route: '',
      },
      {
        name: 'Credit Administration',
        iconname: 'minus',
        route: '',
      },
    ],
  },

  // {
  //   name: 'MIS Report',
  //   iconname: 'file-lines',
  //   route: '',
  // },
  // {
  //   name: 'Configuration',
  //   iconname: 'wrench',
  //   route: 'application-option',
  // },
];

// seperated config
export const APPRAISAL_MENU_APPROVAL_CONFIG: ISidebarMenuModel[] = [
  {
    name: 'MIS Report',
    iconname: 'file-lines',
    route: '',
  },
  {
    name: 'Configuration',
    iconname: 'wrench',
    route: 'application-option',
  },
];

export const SIDEBAR_MENU_BM: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Credit Proposal',
    iconname: 'arrow-trend-up',
    children: [
      {
        name: 'Credit Proposal',
        iconname: 'minus',
        route: 'credit-proposal-status',
      },
      {
        name: 'Credit Proposal Approval',
        iconname: 'minus',
        route: 'cp-status-approval',
      },
    ],
  },
];

export const SIDEBAR_MENU_SME_HEAD: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
    ],
  },
  {
    name: 'Credit Proposal',
    iconname: 'arrow-trend-up',
    children: [
      {
        name: 'Credit Proposal',
        iconname: 'minus',
        route: 'credit-proposal-status',
      },
      {
        name: 'Credit Proposal Approval',
        iconname: 'minus',
        route: 'cp-status-approval',
      },
    ],
  },
  // {
  //   name: 'Loan Analysis & Approval',
  //   iconname: 'paperclip',
  //   children: [
  //     {
  //       name: 'Loan Analysis Distribution',
  //       iconname: 'minus',
  //       route: 'la-distribution',
  //     },
  //     {
  //       name: 'Compliance Checking Distribution',
  //       iconname: 'minus',
  //       route: 'cc-distribution',
  //     },
  //   ],
  // },
  // {
  //   name: 'Offering Letter & Legal',
  //   iconname: 'square-check',
  //   children: [
  //     {
  //       name: 'Distribution Offering Letter',
  //       iconname: 'minus',
  //       route: 'distribution',
  //     },
  //   ],
  // },
];

export const MENU_MASTER: ISidebarMenuModel[] = [
  {
    name: 'Master',
    iconname: 'house',
    children: [
      {
        name: 'Internal',
        iconname: 'minus',
        route: 'internal',
      },
      {
        name: 'Position Type',
        iconname: 'minus',
        route: 'position-type',
      },
      {
        name: 'Approval Structure',
        iconname: 'minus',
        route: 'position-reporting-structure',
      },
      {
        name: 'Employee',
        iconname: 'minus',
        route: 'employee',
      },
      {
        name: 'Partner KJPP',
        iconname: 'minus',
        route: 'partner-kjpp',
      },

      {
        name: 'Uom Conversion',
        iconname: 'minus',
        route: 'uom-conversion',
      },
      {
        name: 'Geo Boundary',
        iconname: 'minus',
        route: 'geo-boundary',
      },
      {
        name: 'Industry Limit Exposure Parameter',
        iconname: 'minus',
        route: 'industry-limit-exposure-parameter',
      },
      {
        name: 'Legal Lending Limit Type',
        iconname: 'minus',
        route: 'legal-lending-limit-parameter',
      },
      {
        name: 'Document Checklist',
        iconname: 'minus',
        route: 'document-type',
      },
      {
        name: 'Lending Program Parameter',
        iconname: 'minus',
        route: 'lending-program-parameter',
      },
      {
        name: 'List Of Value',
        iconname: 'minus',
        route: 'list-of-value-parameter',
      },
      {
        name: 'Product',
        iconname: 'minus',
        route: 'master-product-parameter',
      },
      {
        name: 'Collateral',
        iconname: 'minus',
        route: 'collateral-parameter',
      },
      {
        name: 'Compliance Checklist',
        iconname: 'minus',
        route: 'master-compliance-checklist',
      },
    ],
  },
  // {
  //   name: 'Configuration',
  //   iconname: 'wrench',
  //   route: 'application-option',
  // },
];

// seperated config
export const MENU_MASTER_CONFIG: ISidebarMenuModel[] = [
  {
    name: 'Configuration',
    iconname: 'wrench',
    route: 'application-option',
  },
];

export const SIDEBAR_MENU_ROLE_SME_HEAD: ISidebarMenuModel[] = [
  {
    name: 'Credit Proposal',
    iconname: 'arrow-trend-up',
    children: [
      {
        name: 'Credit Proposal',
        iconname: 'minus',
        route: 'credit-proposal-status',
      },
      {
        name: 'Credit Proposal Approval',
        iconname: 'minus',
        route: 'cp-status-approval',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis Distribution',
        iconname: 'minus',
        route: 'la-distribution',
      },
      {
        name: 'Compliance Checking Distribution',
        iconname: 'minus',
        route: 'cc-distribution',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Distribution Offering Letter',
        iconname: 'minus',
        route: 'distribution',
      },
    ],
  },
];
export const SIDEBAR_MENU_APR_DH: ISidebarMenuModel[] = [
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Appraisal Distribution External',
        iconname: 'minus',
        route: 'batch-apprisal',
      },
      {
        name: 'Appraisal Distribution Internal',
        iconname: 'minus',
        route: 'batch-apprisal/internal',
      },
      {
        name: 'Appraisal Report Approval',
        iconname: 'minus',
        route: 'batch-apprisal/approval',
      },
      {
        name: 'Appraisal Result Inquiry',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
    ],
  },
];

export const SIDEBAR_MENU_DH: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Appraisal Report Approval',
        iconname: 'minus',
        route: 'batch-apprisal/approval',
      },
    ],
  },
  {
    name: 'Credit Proposal',
    iconname: 'arrow-trend-up',
    children: [
      {
        name: 'Credit Proposal',
        iconname: 'minus',
        route: 'credit-proposal-status',
      },
      {
        name: 'Credit Proposal Approval',
        iconname: 'minus',
        route: 'cp-status-approval',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
    ],
  },
];

export const APPRAISAL_MENU_TL: ISidebarMenuModel[] = [
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Appraisal Distribution External',
        iconname: 'minus',
        route: 'batch-apprisal',
      },
      {
        name: 'Appraisal Distribution Internal',
        iconname: 'minus',
        route: 'batch-apprisal/internal',
      },
      // {
      //   name: 'Appraisal Process',
      //   iconname: 'minus',
      //   route: 'batch-apprisal/process',
      // },
      {
        name: 'Appraisal Report Approval',
        iconname: 'minus',
        route: 'batch-apprisal/approval',
      },
      {
        name: 'Appraisal Result Inquiry',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
    ],
  },
];

export const APPRAISAL_MENU_CRA: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis Distribution',
        iconname: 'minus',
        route: 'la-distribution',
      },
    ],
  },
];
export const APPRAISAL_MENU_CHECKER: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis',
        iconname: 'minus',
        route: 'la-analyst',
      },
      {
        name: 'Loan Analysis Distribution',
        iconname: 'minus',
        route: 'la-distribution',
      },
      {
        name: 'Loan Analysis SME Credit Review Checker',
        iconname: 'minus',
        route: 'la-SME-CRC',
      },
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
      {
        name: 'Final DAR - Checker',
        iconname: 'minus',
        route: 'dar-checker',
      },
    ],
  },
];
export const APPRAISAL_MENU_CHECKER1: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis',
        iconname: 'minus',
        route: 'la-analyst',
      },
      {
        name: 'Loan Analysis Distribution',
        iconname: 'minus',
        route: 'la-distribution',
      },
      {
        name: 'Loan Analysis SME Credit Review Checker',
        iconname: 'minus',
        route: 'la-SME-CRC',
      },
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
      {
        name: 'Final DAR - Checker',
        iconname: 'minus',
        route: 'dar-checker',
      },
    ],
  },
];
export const APPRAISAL_MENU_CHECKER2: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis',
        iconname: 'minus',
        route: 'la-analyst',
      },
      {
        name: 'Loan Analysis Distribution',
        iconname: 'minus',
        route: 'la-distribution',
      },
      {
        name: 'Loan Analysis SME Credit Review Checker',
        iconname: 'minus',
        route: 'la-SME-CRC',
      },
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
      {
        name: 'Final DAR - Checker',
        iconname: 'minus',
        route: 'dar-checker',
      },
    ],
  },
];

export const APPRAISAL_MENU_HCR: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis',
        iconname: 'minus',
        route: 'la-analyst',
      },
      {
        name: 'Loan Analysis Distribution',
        iconname: 'minus',
        route: 'la-distribution',
      },
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
      {
        name: 'Final DAR - Checker',
        iconname: 'minus',
        route: 'dar-checker',
      },
    ],
  },
];

export const APPRAISAL_MENU_BUSINESS_DIR: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
    ],
  },
];
export const APPRAISAL_MENU_CREDIT_DIR: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
    ],
  },
];

export const APPRAISAL_MENU_FINANCE_DIR: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
    ],
  },
];

export const APPRAISAL_MENU_CC_ANALYST: ISidebarMenuModel[] = [
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Compliance Checking',
        iconname: 'minus',
        route: 'cc-checking',
      },
      {
        name: 'Compliance Checking Inquiry',
        iconname: 'minus',
        route: 'cc-inquiry',
      },
    ],
  },
];
export const APPRAISAL_MENU_CC_ADMIN: ISidebarMenuModel[] = [
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Compliance Checking Distribution',
        iconname: 'minus',
        route: 'cc-distribution',
      },
      {
        name: 'Compliance Checking Inquiry',
        iconname: 'minus',
        route: 'cc-inquiry',
      },
    ],
  },
];
export const APPRAISAL_MENU_CC_DEPT_HEAD: ISidebarMenuModel[] = [
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Compliance Checking Review',
        iconname: 'minus',
        route: 'cc-review',
      },
    ],
  },
];
export const APPRAISAL_MENU_CC_DH: ISidebarMenuModel[] = [
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Compliance Checking Review',
        iconname: 'minus',
        route: 'cc-review',
      },
    ],
  },
];

export const APPRAISAL_MENU_CC_DIR: ISidebarMenuModel[] = [
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Compliance Checking Review',
        iconname: 'minus',
        route: 'cc-review',
      },
    ],
  },
];
export const APPRAISAL_MENU_LEGAL_HEAD: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Offering Letter Review',
        iconname: 'minus',
        route: 'review',
      },
    ],
  },
];

export const APPRAISAL_MENU_LEGALOFFICER_OUTREGION: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Finalize Offering Letter',
        iconname: 'minus',
        route: 'finalize',
      },
    ],
  },
];
export const APPRAISAL_MENU_LEGAL_OFFICER: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Finalize Offering Letter',
        iconname: 'minus',
        route: 'finalize',
      },
    ],
  },
];

export const APPRAISAL_MENU_CRO: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Analysis',
        iconname: 'minus',
        route: 'la-analyst',
      },

      {
        name: 'DAR Finalization',
        iconname: 'minus',
        route: 'dar-final',
      },

      {
        name: 'Loan Committee Approval',
        iconname: 'minus',
        route: 'loan-committee-approval',
      },
      {
        name: 'DAR Notification',
        iconname: 'minus',
        route: 'dar-notif',
      },
    ],
  },
];

export const APPRAISAL_APR_DEPT_HEAD: ISidebarMenuModel[] = [
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Appraisal Distribution External',
        iconname: 'minus',
        route: 'batch-apprisal',
      },
      {
        name: 'Appraisal Distribution Internal',
        iconname: 'minus',
        route: 'batch-apprisal/internal',
      },
      {
        name: 'Appraisal Report Approval',
        iconname: 'minus',
        route: 'batch-apprisal/approval',
      },
      {
        name: 'Appraisal Result Inquiry',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
    ],
  },
];

export const APPRAISAL_DEPT_HEAD: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
      {
        name: 'SLIK Checking',
        iconname: 'minus',
        route: 'request-slik',
      },
    ],
  },
  {
    name: 'Credit Proposal',
    iconname: 'arrow-trend-up',
    children: [
      {
        name: 'Credit Proposal',
        iconname: 'minus',
        route: 'credit-proposal-status',
      },
      {
        name: 'Credit Proposal Approval',
        iconname: 'minus',
        route: 'cp-status-approval',
      },
    ],
  },
  {
    name: 'Loan Analysis & Approval',
    iconname: 'paperclip',
    children: [
      {
        name: 'Loan Approval',
        iconname: 'minus',
        route: 'la-approval',
      },
      {
        name: 'Loan Approval Inquiry',
        iconname: 'minus',
        route: 'la-approval-inquiry',
      },
    ],
  },
];

export const APPRAISAL_MENU_SIDEBAR_ALL: ISidebarMenuModel[] = [];

export const APPRAISAL_DEPT_CREDIT_LEGAL_LEAD: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Distribution Offering Letter',
        iconname: 'minus',
        route: 'distribution',
      },
      {
        name: 'Offering Letter Review',
        iconname: 'minus',
        route: 'review',
      },
    ],
  },
];

export const APPRAISAL_MENU_ADMIN_APPRAISAL: ISidebarMenuModel[] = [
  {
    name: 'Appraisal',
    iconname: 'file',
    children: [
      {
        name: 'Appraisal Distribution External',
        iconname: 'minus',
        route: 'batch-apprisal',
      },
      {
        name: 'Appraisal Distribution Internal',
        iconname: 'minus',
        route: 'batch-apprisal/internal',
      },
      {
        name: 'Appraisal Result Inquiry',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
    ],
  },
];

export const APPRAISAL_MENU_LEGAL_TEAM_LEAD: ISidebarMenuModel[] = [
  {
    name: 'Initiation',
    iconname: 'pencil-alt',
    children: [
      {
        name: 'Initial Debtor Data',
        iconname: 'minus',
        route: 'party-cif',
      },
    ],
  },
  {
    name: 'Offering Letter & Legal',
    iconname: 'square-check',
    children: [
      {
        name: 'Offering Letter Review',
        iconname: 'minus',
        route: 'review',
      },
    ],
  },
];
