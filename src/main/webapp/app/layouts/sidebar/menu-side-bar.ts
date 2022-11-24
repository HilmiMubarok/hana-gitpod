import { ISidebarMenuModel } from './sidebar.model';
export const APPRAISAL_MENU_ADMIN: ISidebarMenuModel[] = [
  {
    name: 'Master',
    iconname: 'house',
    children: [
      {
        name: 'Employee',
        iconname: 'minus',
        route: 'employee',
      },
      {
        name: 'Position',
        iconname: 'minus',
        route: 'position',
      },
      {
        name: 'Partner KJPP',
        iconname: 'minus',
        route: 'partner-kjpp',
      },
      {
        name: 'Branch',
        iconname: 'minus',
        route: 'branch',
      },
      {
        name: 'Uom Conversion',
        iconname: 'minus',
        route: 'uom-conversion',
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
        name: 'Request Appraisal',
        iconname: 'minus',
        route: 'collateral-appraisal',
      },
      {
        name: 'Appraisal Distribution External',
        iconname: 'minus',
        route: 'batch-apprisal',
        // route: 'collateral-appraisal-distribution-external',
      },
      {
        name: 'Appraisal Distribution Internal',
        iconname: 'minus',
        route: 'collateral-appraisal-distribution-internal',
      },
      {
        name: 'Appraisal Process',
        iconname: 'minus',
        route: 'collateral-appraisal-process',
      },
      {
        name: 'Appraisal Report Approval',
        iconname: 'minus',
        route: 'collateral-appraisal-report-approval',
      },
      {
        name: 'Appraisal Result Inqury',
        iconname: 'minus',
        route: 'collateral-appraisal-result-inqury',
      },
      // {
      //   name: 'Batch Appraisal',
      //   iconname: 'minus',
      //   route: 'batch-apprisal',
      // },
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
        name: 'Loan Komite Approval',
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
      // {
      //   name: 'Legal Process',
      //   iconname: 'minus',
      //   route: '',
      // },
    ],
  },
  {
    name: 'Disbursment',
    iconname: 'suitcase',

    children: [
      {
        name: 'Request Disbursment',
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

export const APPRAISAL_MENU_RM: ISidebarMenuModel[] = [
  {
    name: 'Master',
    iconname: 'house',
    children: [
      {
        name: 'Employee',
        iconname: 'minus',
        route: 'employee',
      },
      {
        name: 'Position',
        iconname: 'minus',
        route: 'position',
      },
      {
        name: 'Partner KJPP',
        iconname: 'minus',
        route: 'partner-kjpp',
      },
      {
        name: 'Branch',
        iconname: 'minus',
        route: 'branch',
      },
      {
        name: 'Uom Conversion',
        iconname: 'minus',
        route: 'uom-conversion',
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
        name: 'Loan Komite Approval',
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
      // {
      //   name: 'Legal Process',
      //   iconname: 'minus',
      //   route: '',
      // },
    ],
  },
  {
    name: 'Disbursment',
    iconname: 'suitcase',

    children: [
      {
        name: 'Request Disbursment',
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

export const APPRAISAL_MENU_SURVEYOR: ISidebarMenuModel[] = [
  {
    name: 'Master',
    iconname: 'house',
    children: [
      {
        name: 'Employee',
        iconname: 'minus',
        route: 'employee',
      },
      {
        name: 'Position',
        iconname: 'minus',
        route: 'position',
      },
      {
        name: 'Partner KJPP',
        iconname: 'minus',
        route: 'partner-kjpp',
      },
      {
        name: 'Branch',
        iconname: 'minus',
        route: 'branch',
      },
      {
        name: 'Uom Conversion',
        iconname: 'minus',
        route: 'uom-conversion',
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
        name: 'Appraisal Process',
        iconname: 'minus',
        route: 'collateral-appraisal-process',
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
        name: 'Loan Komite Approval',
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
      // {
      //   name: 'Legal Process',
      //   iconname: 'minus',
      //   route: '',
      // },
    ],
  },
  {
    name: 'Disbursment',
    iconname: 'suitcase',

    children: [
      {
        name: 'Request Disbursment',
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

export const APPRAISAL_MENU_APPROVAL: ISidebarMenuModel[] = [
  {
    name: 'Master',
    iconname: 'house',
    children: [
      {
        name: 'Employee',
        iconname: 'minus',
        route: 'employee',
      },
      {
        name: 'Position',
        iconname: 'minus',
        route: 'position',
      },
      {
        name: 'Partner KJPP',
        iconname: 'minus',
        route: 'partner-kjpp',
      },
      {
        name: 'Branch',
        iconname: 'minus',
        route: 'branch',
      },
      {
        name: 'Uom Conversion',
        iconname: 'minus',
        route: 'uom-conversion',
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
        route: 'collateral-appraisal-report-approval',
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
        name: 'Loan Komite Approval',
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
      // {
      //   name: 'Legal Process',
      //   iconname: 'minus',
      //   route: '',
      // },
    ],
  },
  {
    name: 'Disbursment',
    iconname: 'suitcase',

    children: [
      {
        name: 'Request Disbursment',
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

export const APPRAISAL_MENU_ADMIN_APPRAISAL: ISidebarMenuModel[] = [
  {
    name: 'Master',
    iconname: 'house',
    children: [
      {
        name: 'Employee',
        iconname: 'minus',
        route: 'employee',
      },
      {
        name: 'Position',
        iconname: 'minus',
        route: 'position',
      },
      {
        name: 'Partner KJPP',
        iconname: 'minus',
        route: 'partner-kjpp',
      },
      {
        name: 'Branch',
        iconname: 'minus',
        route: 'branch',
      },
      {
        name: 'Uom Conversion',
        iconname: 'minus',
        route: 'uom-conversion',
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
        name: 'Appraisal Distribution External',
        iconname: 'minus',
        route: 'batch-apprisal',
        // route: 'collateral-appraisal-distribution-external',
      },
      {
        name: 'Appraisal Distribution Internal',
        iconname: 'minus',
        route: 'collateral-appraisal-distribution-internal',
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
        name: 'Loan Komite Approval',
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
      // {
      //   name: 'Legal Process',
      //   iconname: 'minus',
      //   route: '',
      // },
    ],
  },
  {
    name: 'Disbursment',
    iconname: 'suitcase',

    children: [
      {
        name: 'Request Disbursment',
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
