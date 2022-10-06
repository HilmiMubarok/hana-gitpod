export enum SUB_COLLATERAL_TYPE_PROPERTY {
  RUMAHTINGGAL = 'Rumah Tinggal',
  RUKO = 'Ruko',
  APARTEMEN = 'Apartemen',
  OFFICESPACE = 'Office Space',
  KIOS = 'Kios',
  PABRIK = 'Pabrik',
  GUDANG = 'Gudang',
}

export enum SUB_COLLATERAL_TYPE_VEHICLE {
  VEHICLE = 'Kendaraan',
}

export enum SUB_COLLATERAL_TYPE_MACHINE {
  HEAVYEQUIPMENT = 'Alat Berat',
}

export enum SUB_COLLATERAL_TYPE_REALESTATE {
  LAND = 'Tanah / Kavling',
}

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

export enum COLLATERAL_TYPE_DETAIL {
  AN020101 = 'tanah',
  AN02010201 = 'gedung / ruang kantor',
  AN02010202 = 'gudang',
  AN02010203 = 'rumah toko / rumah kantor',
  AN02010204 = 'hotel',
  AN02010299 = 'properti komersial lainnya',
  AN02010301 = 'rumah',
  AN02010302 = 'apartemen / rumah susun',
  AN020202 = 'mesin',
  AN020203 = 'kendaraan',
  AN020299 = 'aset tetap dan inventaris lainnya',
  AN0205 = 'pesawat udara',
  AN0206 = 'kapal laut / transportasi air',
  AN0299 = 'aset non keuangan lainnya',
  AN999901 = 'persediaan',
  F0401 = 'sertifikat bank indonesia(SBI)',
  F0402 = 'sertifikat bank indonesia syariah(SBIS)',
  F0403 = 'sertifikat deposito bank indonesia(SDBI)',
  F0404 = 'Surat Berharga Bank Indonesia(SBBI) dalam Valuta Asing',
  F040501 = 'Surat Perbendaharaan Negara(SPN)',
  F040502 = 'Surat Perbendaharaan Negara Syariah',
  F041401 = 'Reksadana',
  F041402 = 'Sertifikat Reksadana Syariah',
  F041403 = 'Reksadana Dana Pendapatan Tetap',
  F04150102 = 'Obligasi Negara(ON)',
  F04150103 = 'Obligasi Ritel Indonesia(ORI)',
  F04150106 = 'Obligasi Daerah',
  F04150201 = 'Sukuk Bank Indonesia',
  F04150203 = 'Sukuk Negara',
  F04150204 = 'Sukuk Ritel',
  F04150205 = 'Ijarah Fixed Rate',
  F04150299 = 'Sukuk Lainnya',
  F0418 = 'Resi Gudang',
  F0419 = 'Saham',
  F0420 = 'Asuransi Kredit / Pembiayaan',
  F0499 = 'Surat Berharga Lainnya',
  F09 = 'Giro',
  F10 = 'Tabungan',
  F11 = 'Deposito',
  F15 = 'Setoran Jaminan',
  F2001 = 'Emas dan mata uang emas',
  F2099 = 'Aset Keuangan Lainnya',
  F4101 = 'L / C',
  F4102 = 'SKBDN',
  F42 = 'Garansi',
  F4205 = 'Standby L / C',
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

export const SUBMENU_COLLATERAL_APPRAISAL: object[] = [
  {
    id: 'appraisal-info',
    text: 'appraisal info',
  },
  {
    id: 'customer-info',
    text: 'customer info',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'valuation',
    text: 'valueation',
  },
  {
    id: 'negative-collateral',
    text: 'negative collateral',
  },
  {
    id: 'comparison-data',
    text: 'comparison data',
  },
  {
    id: 'foto-object-jaminan',
    text: 'foto object jaminan',
  },
  {
    id: 'summary',
    text: 'summary',
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

export const SUBMENU_LOAN_ANALYS: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary'
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
	child: [
      {
        id: 'proposal-info',
        text: 'Proposal Info'
      },
      {
        id: 'rm-info',
        text: 'RM Info'
      },
      {
        id: 'customer-info',
        text: 'Customer Info'
      },
	  {
        id: 'loan-facility',
        text: 'Loan Facility'
      },
      {
        id: 'exposure',
        text: 'Exposure'
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info'
      },
	  {
        id: 'summary',
        text: 'Summary'
      },
      {
        id: 'correspondence',
        text: 'Correspondence'
      }
    ]
  },
  {
    id: 'slik-checking',
    text: 'SLIK Checking'
  },
  {
    id: 'opinion',
    text: 'Opinion'
  },
  {
    id: 'compare-data',
    text: 'Compare Data'
  }
];