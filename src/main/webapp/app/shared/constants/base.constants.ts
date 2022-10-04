export enum RELATION_WITH_HANA {
  A = 'Pengendali dan atau keluarga pengendali Bank',
  B = 'Perusahaan/badan dimana Bank bertindak sebagai pengendali (subsidiary)',
  C = 'Pengendali lain dari anak perusahaan/subsidiary Bank',
  D = 'Perusahaan dimana pihak sebagaimana dimaksud pada angka 1 bertindak sebagai pengendali',
  E = 'Perusahaan dimana pihak sebagaimana dimaksud pada angka 3 bertindak sebagai pengendali.',
  F = 'Pengurus Bank dan atau keluarga pengurus Bank',
  G = 'Pengurus dari perusahaan-perusahaan sebagaimana dimaksud pada angka 1-5',
  H = 'Perusahaan yang pengurusnya merupakan pengurus Bank',
  I = 'Perusahaan yg pengurusnya mrpkn pengurus dr perusahaan2 sebagaimana dimaksud pd angka 1-5',
  J = 'Perusahaan dimana pengurus Bank bertindak sebagai pengendali',
  K = 'Perusahaan dimana pngurus dr perusahaan2 sebagaimana dmksd pd angka 1-5 brtindak sbg pengendali',
  L = 'Ketergantungan keuangan (financial interdependence)',
  M = 'KIK dmn pihak2 sbgmn dmksd pd angka 1-11 mmiliki 10% / lbh saham pd manajer investasi kolektif tsb',
  N = 'Penjaminan',
  O = 'TIDAK TERKAIT DENGAN BANK',
}

export enum CATEGORY_DEBTOR {
  MICRO = '70',
  SMALL = '80',
  MIDDLE = '90',
  OTHER = '99',
}

export enum UMKM_CLASSIFICATION {
  MICRO = 'Total Penjualan <= 1M Or Modal Disetor <= 2M',
  SMALL = 'Total penjualan <= 5M OR Modal disetor <= 15M',
  MIDDLE = 'Total penjualan <= 10M OR Modal disetor <= 50M',
  OTHER = 'Non-UMKM',
}

export enum MARITAL_STATUS {
  KAWIN = 'Kawin',
  CERAI = 'Cerai',
  LAJANG = 'Lajang',
  NA = 'Not Available',
}

export enum GENDER {
  PRIA = 'Laki - Laki',
  PEREMPUAN = 'Perempuan',
  NA = 'Not Available',
}

export enum BLOOD_TYPE {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
  NA = 'NOT AVAILABLE',
}

export enum COLLECTABILITY_STATUS {
  KOL1 = 'Kol-1',
  KOL2 = 'Kol-2',
  KOL3 = 'Kol-3',
  KOL4 = 'Kol-4',
  KOL5 = 'Kol-5',
}

export enum DOCUMENT_TYPE_COLLATERAL_PROPERTY {
  SHM = 'SHM',
  SHGB = 'SHGB',
  SHMASRS = 'SHMASRS',
  PPJB = 'PPJB',
  AJB = 'AJB',
  IMB = 'IMB',
  PBB = 'PBB',
  INVOICE = 'INVOICE',
  LAINNYA = 'LAINNYA',
}

export enum APPLICATION_TYPE {
  BUSINESS_UNIT = 'BUSINESS_UNIT',
}

export enum POSITION_TYPE {
  RM = 'RM',
}

export enum DOCUMENT_TYPE_COLLATERAL_VEHICLE {
  BPKB = 'BPKB',
  STNK = 'STNK',
  FAKTUR = 'FAKTUR',
  INVOICE = 'INVOICE',
  LAINNYA = 'LAINNYA',
}

export enum DOCUMENT_TYPE_COLLATERAL_MACHINE {
  FAKTUR = 'FAKTUR',
  INVOICE = 'INVOICE',
  LAINNYA = 'LAINNYA',
}

export enum DOCUMENT_TYPE_APPRAISAL {
  BUKTI_BAYAR_APPRAISAL = 'Bukti Bayar Appraisal',
  MEMO_PENDING_BAYAR = 'Memo Pending Bayar',
  PENILAIAN_SEBELUMNYA = 'Penilaian Sebelumnya',
  FOTO_OBJEK = 'Foto Objek',
  LPA_KJPP_SEBELUMNYA = 'LPA KJPP Sebelumnya',
}

export enum CODE {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSE = 'CLOSE',
  HIDE = 'HIDE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  PENDING = 'PENDING',
  BILLED = 'BILLED',
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
  SUSPEND = 'SUSPEND',
  CANCEL = 'CANCEL',
  COMPLETE = 'COMPLETE',
  RESCHEDULE = 'RESCHEDULE',
  USER_CODE = 'USERCODE',
}

export enum FACILITY_TYPE {
  OD = 'OD',
  WCI = 'WCI',
  DL = 'DL',
  MML = 'MML',
  FL = 'FL',
  TR = 'TR',
  EARC = 'E-ARC',
  IL = 'IL',
  BG = 'BG',
  LC = 'LC',
  FN = 'FN - Syndication Loan / Club Deal',
}

export const GEO_BOUNDARY_TYPE: Object = {
  country: 110,
  province: 111,
  city: 112,
  district: 113,
  village: 114,
  postal: 115,
};

export const COLLATERAL_TYPE: Object = {
  property: 'PROPERTY',
  machine: 'MACHINE',
  vehicle: 'VEHICLE',
  realestate: 'REALESTATE',
};

/**
 * VARIABLE FOR EJ2 SYNCFUSION
 */
export const ANIMATION: Object = {
  previous: {
    effect: '',
    duration: 0,
    easing: '',
  },
  next: {
    effect: '',
    duration: 0,
    easing: '',
  },
};

export const PROPOSAL_TYPE: object[] = [
  {
    id: 'greater-15-bn',
    text: 'Total Exposure > IDR 15 Bn',
  },
  {
    id: 'lower-equal-15-bn',
    text: 'Total Exposure <= IDR 15 Bn',
  },
  {
    id: 'back-to-back',
    text: 'Total Exposure Back to Back',
  },
];

export const SUBMENU_PARTY_CIF: object[] = [
  {
    id: 'customer',
    text: 'customer',
    child: [
      {
        id: 'customer-info',
        text: 'customer info',
      },
      {
        id: 'organization-management',
        text: 'organization management',
      },
      {
        id: 'management-data',
        text: 'management / shareholder / group',
      },
    ],
  },
  {
    id: 'document-checklist',
    text: 'document checklist',
  },
  {
    id: 'facility-info',
    text: 'facility info',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'financial-info',
    text: 'financial info',
  },
  {
    id: 'credit-rating',
    text: 'credit rating',
  },
  {
    id: 'slik',
    text: 'slik',
  },
  {
    id: 'decision-approval-report',
    text: 'decision approval report',
  },
];

export const BASIC_SUBMENU_CREDITPROPOSAL: object[] = [
  {
    id: 'basic-information',
    text: 'basic information',
  },
  {
    id: 'document-checklist',
    text: 'document checklist',
  },
  {
    id: 'business-activity',
    text: 'business activity',
  },
  {
    id: 'loan-facility-detail',
    text: 'loan facility detail',
  },
  {
    id: 'exposure',
    text: 'exposure',
  },
  {
    id: 'risk-acceptance-criteria',
    text: 'risk acceptance criteria',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'management-information',
    text: 'management information',
  },
  {
    id: 'financial-statement',
    text: 'financial statement',
  },
  {
    id: 'slik-checking',
    text: 'slik checking',
  },
  {
    id: 'bank-account-analyst',
    text: 'bank account analysis',
  },
  {
    id: 'propose-pricing',
    text: 'propose pricing',
  },
  {
    id: 'convenant-tbo',
    text: 'convenant & TBO',
  },
  {
    id: 'summary',
    text: 'summary',
  },
];

export const SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN: object[] = [
  {
    id: 'repayment-capability',
    text: 'repayment capability',
  },
];

export const SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN: object[] = [
  {
    id: 'group-guarantour-analyst',
    text: 'group & guarantour analyst',
  },
  {
    id: 'trade-checking',
    text: 'trade checking',
  },
  {
    id: 'credit-rating',
    text: 'credit rating',
  },
  {
    id: 'customer-profit',
    text: 'customer profitability & cross selling factor',
  },
];
