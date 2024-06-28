import { IEJOptionNode, IOptionNode } from '../model/option-node.model';

export enum RELATION_TYPE {
  DAR = 'DAR',
  COMPLIANCE = 'COMPLIANCE',
  OL_APPROVAL = 'OL_APPROVAL',
  OFFERING_LETTER = 'OFFERING_LETTER',
  CREDIT_PROPOSAL = 'CREDIT_PROPOSAL',
  LOAN_ANALYSIS = 'LOAN_ANALYSIS',
  DPPK = 'DPPK',
  DPPK_REVIEW1 = 'DPPK_REVIEW1',
  DPPK_REVIEW2 = 'DPPK_REVIEW2',
  LOAN_OPERATION = 'LOAN_OPERATION',
  LOAN_OPERATION_APPROVAL = 'LOAN_OPERATION_APPROVAL',
}

export enum PARTY_TYPE {
  PERSON = 'PERSON',
  PARTYGROUP = 'PARTY_GROUP',
}

export enum CUSTOMER_TYPE {
  PERSONAL = 'PERSONAL',
  CORPORATE = 'CORPORATE',
}

export enum PARAMETER_TYPE {
  LEGALLENDINGLIMIT = 'LEGAL_LENDING_LIMIT',
  CREDIT_AGREEMENT_CLAUSAL = 'CREDIT_AGREEMENT_CLAUSAL',
}

export enum SUB_COLLATERAL_TYPE_PROPERTY {
  RUMAHTINGGAL = 'Rumah Tinggal',
  RUKO = 'Ruko',
  APARTEMEN = 'Apartemen',
  OFFICESPACE = 'Office Space',
  KIOS = 'Kios',
  PABRIK = 'Pabrik',
  GUDANG = 'Gudang',
}

export enum BANK_LIST {
  BCA = 'Bank BCA',
  MANDIRI = 'Bank Mandiri',
  BNI = 'Bank BNI',
  OCBC = 'Bank OCBC Nisp',
  CIMB = 'Bank CIMB Niaga',
  BRIS = 'Bank BRI Syariah',
  BRI = 'Bank BRI',
  BJB = 'Bank BJB',
  DANAMON = 'Bank Danamon',
  OTHER = 'Bank Lain-Lain',
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
  MICRO = 'Micro',
  SMALL = 'Kecil',
  MIDDLE = 'Menengah',
  OTHER = 'Non-UMKM',
}

export enum MARITAL_STATUS {
  KAWIN = 'Kawin',
  LAJANG = 'Lajang',
  DUDA = 'Duda',
  JANDA = 'Janda',
  NA = 'Not Available',
}

export enum GENDER {
  L = 'Male',
  P = 'Female',
}

export enum BLOOD_TYPE {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
  NA = 'NOT AVAILABLE',
}

export enum COLLECTABILITY_STATUS {
  KOL1 = '1',
  KOL2 = '2',
  KOL3 = '3',
  KOL4 = '4',
  KOL5 = '5',
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

export enum DIRECTION {
  SUPERORDINATE = 'SUPERORDINATE',
  SUBORDINATE = 'SUBORDINATE',
}

export enum POSITION_TYPE {
  BM = 'BM',
  CRO = 'CRO',
  DEPT_HEAD = 'DEPT_HEAD',
  DH = 'DH',
  RM = 'RM',
  SDH = 'SDH',
  TL = 'TL',
  UH = 'UH',
  ADMIN_APPRAISER = 'ADMIN_APPRAISER',
  SURVEYOR = 'SURVEYOR',
  APR_DEPT_HEAD = 'APR_DEPT_HEAD',
  APR_DH = 'APR_DH',
  CRC = 'CRC',
  HCR1 = 'HCR1',
  HCR2 = 'HCR2',
  CC_ANALYST = 'CC_ANALYST',
  LEGAL_OFFICER = 'LEGAL_OFFICER',
  LEGALOFFICER_OUTREGION = 'LEGALOFFICER_OUTREGION',
  SME_HEAD = 'SME_HEAD',
  CRA = 'CRA',
  CC_ADMIN = 'CC_ADMIN',
  CC_DH = 'CC_DH',
  CC_DEPT_HEAD = 'CC_DEPT_HEAD',
  CREDIT_LEGAL_LEAD = 'CREDIT_LEGAL_LEAD',
  LEGAL_TEAM_LEAD = 'LEGAL_TEAM_LEAD',
  CC_DIR = 'CC_DIR',
  LEGAL_HEAD = 'LEGAL_HEAD',
  CREDIT_ADMIN = 'CREDIT_ADMIN',
  CREDIT_ADMIN_TEAM_LEAD = 'CREDIT_ADMIN_TEAM_LEAD',
  CREDIT_ADMIN_UNIT_HEAD = 'CREDIT_ADMIN_UNIT_HEAD',
  CREDIT_ADMIN_DEPT_HEAD = 'CREDIT_ADMIN_DEPT_HEAD',
  CREDIT_ADMIN_DIV_HEAD = 'CREDIT_ADMIN_DIV_HEAD',
  LOAN_OPS_SPV = 'LOAN_OPS_SPV',
  LOAN_OPS_ADMIN = 'LOAN_OPS_ADMIN',
}

export enum DOCUMENT_TYPE_COLLATERAL_VEHICLE {
  BPKB = 'BPKB',
  STNK = 'STNK',
  FAKTUR = 'FAKTUR',
  INVOICE = 'INVOICE',
  LAINNYA = 'LAINNYA',
}

export enum DOCUMENT_TYPE_COLLATERAL_MACHINE {
  BPKB = 'BPKB',
  STNK = 'STNK',
  FAKTUR = 'FAKTUR',
  INVOICE = 'INVOICE',
  LAINNYA = 'LAINNYA',
}

export enum DOCUMENT_TYPE_APPRAISAL {
  // BUKTI_BAYAR_APPRAISAL = 'Bukti Bayar Appraisal',
  // MEMO_PENDING_BAYAR = 'Memo Pending Bayar',
  // PENILAIAN_SEBELUMNYA = 'Penilaian Sebelumnya',
  // FOTO_OBJEK = 'Foto Objek',
  // LPA_KJPP_SEBELUMNYA = 'LPA KJPP Sebelumnya',
  // HASIL_APP_EXTERNAL = 'Hasil appraisal External',
  DOCUMET_COLLATERAL_IDD = 'DOC_COLL',
  DOCUMENT_APPRAISAL = 'DOC_APPR',
}

export enum COLLATERAL_BINDING_TYPE {
  CBT01 = 'HAK TANGGUNGAN (APHT)',
  CBT02 = 'Gadai',
  CBT03 = 'FEO',
  CBT04 = 'SKMHT',
  CBT05 = 'CESSIE',
  CBT06 = 'HIPOTIK',
  CBT07 = 'PERNYATAAN JAMINAN & KUASA',
  CBT08 = 'BELUM DIIKAT',
  CBT88 = 'FIDUSIA',
  CBT99 = 'LAINNYA',
}

export enum COLLATERAL_FACILITY_TYPE {
  F01 = 'KREDIT',
  F02 = 'KREDIT JOIN',
  F03 = 'SURAT BERHARGA',
  F04 = 'IRREVOCABLE LC',
  F05 = 'BANK GARANSI',
  F06 = 'FASILITAS LAINNYA',
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

export enum UOM_TYPE {
  CURRENCY = 'CURRENCY_MEASURE',
  AREAMEASURE = 'AREA_MEASURE',
}

export enum OTHER_COLLATERAL_DETAIL_TYPE {
  O901 = 'Credit Default Swap',
  O999 = 'Other Collateral',
}

export enum REALESTATE_COLLATERAL_DETAIL_TYPE {
  R101 = 'Land',
  R102 = 'Residential House',
  R103 = 'Commercial Building',
  R104 = 'Factory (Industrial)',
  R106 = 'Business Rights',
  R199 = 'Other Real Estate',
  R200 = '',
}

export enum PERSONAL_PROPERTIES_COLLATERAL_DETAIL_TYPE {
  R201 = 'Inventories',
  R202 = 'Account Receivables',
  R204 = 'Gold',
  R299 = 'Other Chattels',
}

export enum PERSONAL_PROPERTIES_COLLATERAL_MECHINE_DETAIL_TYPE {
  R203 = ' Machinery and Equipment',
}

export enum PERSONAL_PROPERTIES_COLLATERAL_VEHICLES_DETAIL_TYPE {
  R105 = 'Vehicles',
}

export enum PURPOSE_TYPE {
  DOMICILE = 'DOMICILE_LOCATION',
  GENERAL = 'GENERAL_LOCATION',
  PRIMARY = 'PRIMARY_LOCATION',
  WAREHOUSE = 'WAREHOUSE_LOCATION',
}

export enum SECURITIES_MANAGEMENT_BRANCH {
  S0888 = 'HEAD OFFICE',
  S1101 = 'KPO MANGKULUHUR',
  S1102 = 'KCP PASAR PAGI',
  S1104 = 'KCP THAMRIN RESIDENCE',
  S1105 = 'KCP HARCO MANGGA DUA',
  S1106 = 'KCP LIPPO CIKARANG',
  S1107 = 'KCP KARAWACI PINANGSIA',
  S1108 = 'KCP MUARA KARANG',
  S1110 = 'KCP PONDOK INDAH ',
  S1111 = 'KCP DANAU SUNTER ',
  S1113 = 'KCP BEKASI AHMAD YANI ',
  S1114 = 'KCP PURI INDAH ',
  S1115 = 'KCP WOLTER MONGINSIDI ',
  S1118 = 'KCP PLUIT KENCANA ',
  S1122 = 'KCP KARAWACI AMARTAPURA ',
  S1123 = 'KCP CIKARANG JABABEKA ',
  S1124 = 'KCP KELAPA GADING BARAT ',
  S1127 = ' KCP GADING SERPONG ',
  S1129 = ' KCP BINTARO ',
  S1133 = ' KCP SYNERGY ALAM SUTERA ',
  S1135 = ' KCP KOREA CENTER ',
  S1136 = ' KCP PANTAI INDAH KAPUK ',
  S1137 = ' KCP PLAZA OLEOS ',
  S1138 = ' KCP ROXY SQUARE ',
  S1139 = ' KCP CENTRAL PARK ',
  S1142 = ' KCP WISMA MULIA ',
  S1143 = ' KCP CIBUBUR ',
  S1188 = ' DIGITAL BANKING ',
  S2101 = ' KC BANDUNG DAGO ',
  S2201 = ' KC PADJAJARAN ',
  S2301 = ' KC CILEGON PERMATA ',
  S2302 = ' KCP CILEGON POSCO ',
  S2401 = ' KC SUBANG ',
  S2403 = ' MOBIL CASH CAR ',
  S2501 = ' KC Cirebon ',
  S3101 = ' KC SEMARANG PANDANARAN ',
  S3102 = ' KCP JEPARA ',
  S3201 = ' KC SOLO ',
  S4101 = ' KCP SURABAYA DARMO PERMAI ',
  S4102 = 'KC SURABAYA MANYAR ',
  S4201 = 'KC BALI ',
  S5101 = 'KC LAMPUNG',
  S5202 = 'KC SUDIRMAN',
  S5301 = 'KC PALEMBANG',
  S6101 = 'KC MAKASSAR',
  S6201 = 'KC MANADO',
  S9999 = 'TOTAL',
}

export enum MANAGEMENT_BRANCH {
  HANA = 'KEB HANA',
  OTHERFINANCIAL = 'OTHER FINANCIAL INSTITUION',
  HANAOTHERBRANCH = 'HANA FINANCIAL GROUP OTHER BRANCHES',
  OTHERS = 'OTHRES',
}

export enum REALESTATE_CERTIFICATE_TYPE {
  R001 = ' CASH/TUNAI ',
  R002 = ' TIME DEPOSITO ',
  R003 = ' CURRENT ACCOUNT(O/D)',
  R004 = ' REK. TABUNGAN',
  R005 = ' BDS (BILYET DEPOSIT SIMPANAN)',
  R006 = ' BOND(SECURITY)',
  R007 = ' SAHAM',
  R008 = ' SBPU',
  R009 = ' COMMERCIAL PAPER',
  R010 = ' SHM',
  R011 = ' SHGB',
  R012 = ' SIPTB',
  R013 = ' SIP ( SURAT IJIN PEMAKAIAN )',
  R014 = ' GIRIK',
  R015 = ' FAKTUR/INVOICE',
  R016 = ' BPKB',
  R017 = ' JAMINAN PRIBADI',
  R018 = ' JAMINAN PERUSAHAAN',
  R019 = ' SHM ATAS SATUAN RUMAH SUSUN',
  R020 = ' SERTIFIKAT HAK PAKAI',
  R999 = ' LAINNYA',
}

export enum SECURITIES_COLLATERAL_DETAIL_TYPE {
  S401 = 'Listed Stocks',
  S402 = 'NCDs',
  S403 = 'Government Bonds',
  S404 = 'Settled Claims',
  S405 = 'Credit Link Note(CLN)',
  S406 = 'UCITS/Mutual Fund (Simple Approach)',
  S407 = 'UCITS/Mutual Fund (Comprehensive Approach)',
  S499 = 'Other Securities',
}

export enum DEPOSIT_COLLATERAL_DETAIL_TYPE {
  R301 = 'Time Deposits',
  R302 = 'Installment Deposits',
  R399 = 'Other Deposits',
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
  property: 'PERSONAL_PROPERTY',
  machine: 'MACHINE',
  vehicle: 'VEHICLE',
  realestate: 'REALESTATE',
  securities: 'SECURITIES',
  other: 'OTHER',
  guaranteeLetter: 'LETTER_OF_GUARANTY',
  deposit: 'DEPOSIT',
  personalProperty: 'PERSONAL_PROPERTY',
  personalCorporateGuarantee: 'CORPORATEPERSONALGUARANTEE',
};

export enum COLLATERAL_DEPOSIT_DEBIT_BLOCK {
  ZEROONE = 'Block Account',
  ZEROTWO = 'Debit Account',
}

export enum GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE {
  G501 = ' Stand by L/C',
  G502 = ' Bank Guarantee',
  G503 = ' Financial Guarantee',
  G504 = ' Government Guarantee',
  G505 = ' Insurance Company',
  G599 = ' Other Guarantees',
}

export enum GUARANTEE_TYPE {
  G01 = 'SPECIFIC',
  G02 = 'CONTINUING(LIMITED)',
}

export enum GUARANTEE_COVERAGE {
  G401 = 'PRINCIPAL',
  G402 = 'PRINCIPAL / INTEREST',
  G403 = 'PRINCIPAL / INTEREST / EXPENSES',
}

export enum GUARANTEE_BIS_COL_DETAIL_TYPE {
  G301 = ' (0%)Bank of Korea',
  G302 = ' (0%)Republic of Korea Government',
  G303 = ' (0%)Central Government/Bank in OECD',
  G304 = ' (0%)Central Government/Bank in Other Country(Only Local Currency)',
  G305 = ' (0%)Deposit in KEB',
  G311 = ' (10%)Public Institution in Korea',
  G321 = ' (20%)Banks in Korea',
  G322 = ' (20%)Banks in OECD',
  G323 = ' (20%)Banks in Other Country (Within 1 Year to Maturity)',
  G324 = ' (20%)International Financial Institution (IBRD, ADB etc)',
  G325 = ' (20%)Public Area in Oecd',
  G326 = ' (20%)Public Institution in Korea',
  G332 = ' (50%)Public Institution in Korea',
  G341 = ' (100%)Others',
}

export const STATUS_DOC_CHECKLIST_OPINION = ['CP_ASSIGNMENT', 'CP_CHECKER', 'CP_LOAN_APPROVAL'];

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

export const ID_GREATER_15_BN = 'Total Exposure > IDR 15 Bio';
export const ID_LOWER_EQUAL_15_BN = 'Total Exposure <= IDR 15 Bio';
export const ID_BACK_TO_BACK = 'Total Exposure Back to Back';
export const PROPOSAL_TYPE: IEJOptionNode[] = [
  {
    id: ID_GREATER_15_BN,
    text: 'Total Exposure > IDR 15 Bio',
  },
  {
    id: ID_LOWER_EQUAL_15_BN,
    text: 'Total Exposure <= IDR 15 Bio',
  },
  {
    id: ID_BACK_TO_BACK,
    text: 'Total Exposure Back to Back',
  },
];

export const SEGMENTS_TYPE: object[] = [
  {
    id: 'SME',
    text: 'SME',
  },
  {
    id: 'COMMERCIAL',
    text: 'Commercial Bank',
  },
  {
    id: 'CORPORATE',
    text: 'Corporate Bank',
  },
  {
    id: 'ENTERPRISE',
    text: 'Enterprise Bank',
  },
  {
    id: 'GLOBALBS',
    text: 'Global Business',
  },
];

export const SUBMENU_COLLATERAL_APPRAISAL: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
  },
  {
    id: 'valuation',
    label: 'valuation',
  },
  // {
  //   id: 'negative-collateral',
  //   label: 'negative collateral',
  // },
  {
    id: 'comparison-data',
    label: 'comparison data',
  },
  {
    id: 'foto-object-jaminan',
    label: 'foto objek jaminan',
  },
  {
    id: 'summary',
    label: 'summary',
  },
];

export const SUBMENU_COLLATERAL_APPRAISAL_REALESTATE: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
  },
  {
    id: 'valuation',
    label: 'valuation',
  },
  {
    id: 'negative-collateral',
    label: 'negative collateral',
  },
  {
    id: 'comparison-data',
    label: 'comparison data',
  },
  {
    id: 'foto-object-jaminan',
    label: 'foto objek jaminan',
  },
  {
    id: 'summary',
    label: 'summary',
  },
];

export const SUBMENU_COLLATERAL_APPRAISAL_REALESTATE_ALL: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
  },
  {
    id: 'valuation',
    label: 'valuation',
  },
  {
    id: 'negative-collateral',
    label: 'negative collateral',
  },
  {
    id: 'comparison-data',
    label: 'comparison data',
  },
  {
    id: 'foto-object-jaminan',
    label: 'foto objek jaminan',
  },
  {
    id: 'summary',
    label: 'summary',
  },
];

export const SUBMENU_COLLATERAL_APPRAISAL_MECHINE_VEHICLE: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
  },
  {
    id: 'valuation',
    label: 'valuation',
  },
  // {
  //   id: 'negative-collateral',
  //   label: 'negative collateral',
  // },
  {
    id: 'comparison-data',
    label: 'comparison data',
  },
  {
    id: 'foto-object-jaminan',
    label: 'foto object jaminan',
  },
  {
    id: 'summary',
    label: 'summary',
  },
];

export const SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
  },
  {
    id: 'report-independent',
    label: 'Report Independent',
  },
];

export const SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL_REALESTATE: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
  },
  {
    id: 'negative-collateral',
    label: 'negative collateral',
  },
  {
    id: 'report-independent',
    label: 'Report Independent',
  },
];

export const SUBMENU_COLLATERAL_APPRAISAL_MACHINE: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
  },
  {
    id: 'valuation',
    label: 'valuation',
  },
  // {
  //   id: 'negative-collateral',
  //   label: 'negative collateral',
  // },
  // {
  //   id: 'comparison-data',
  //   label: 'comparison data',
  // },
  {
    id: 'foto-object-jaminan',
    label: 'foto objek jaminan',
  },
  {
    id: 'summary',
    label: 'summary',
  },
];

export const SUBMENU_COLLATERAL_APPRAISAL_ADMIN: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
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
        id: 'organization-legal',
        text: 'organization legal',
      },
      {
        id: 'business-group',
        text: 'business group',
      },
      {
        id: 'management-data',
        text: 'management / shareholder',
      },
    ],
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
    id: 'document-checklist',
    text: 'document checklist',
  },
  {
    id: 'financial-info',
    text: 'financial info',
    // child: [
    //   {
    //     id: 'financial-info',
    //     text: 'upload',
    //   },
    // {
    //   id: 'retrive-info',
    //   text: 'retrieve',
    // },
    // ],
  },
  {
    id: 'credit-rating',
    text: 'credit rating',
  },
  {
    id: 'slik',
    text: 'SLIK Checking',
  },
  {
    id: 'history-proposal',
    text: 'History Proposal',
  },
];

export const BASIC_SUBMENU_CREDITPROPOSAL: object[] = [
  {
    id: 'basic-information',
    text: 'basic information',
  },
  {
    id: 'management-information',
    text: 'management information',
  },
  {
    id: 'risk-acceptance-criteria',
    text: 'risk acceptance criteria',
  },
  {
    id: 'loan-facility-detail',
    text: 'loan facility detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'exposure',
    text: 'exposure',
  },
  {
    id: 'business-activity',
    text: 'business activity',
  },
  {
    id: 'financial-statement',
    text: 'financial statement',
  },
  {
    id: 'slik-checking',
    text: 'SLIK checking',
  },
  {
    id: 'bank-account-analyst',
    text: 'bank account analysis',
  },
  {
    id: 'trade-checking',
    text: 'trade checking',
  },
  {
    id: 'propose-pricing',
    text: 'propose pricing',
  },
  {
    id: 'convenant-tbo',
    text: 'covenant & TBO',
  },
  {
    id: 'summary',
    text: 'summary',
  },
];

export const CP_APPROVAL_MENU: object[] = [
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility-detail',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'group-guarantour-analyst',
        text: 'group & guarantor analyst',
      },
      {
        id: 'slik-checking',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

export const CP_APPROVAL_MENU_BELOW: object[] = [
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility-detail',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'repayment-capability',
        text: 'repayment capability',
      },
      {
        id: 'slik-checking',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

export const CP_APPROVAL_MENU_BTB: object[] = [
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility-detail',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'slik-checking',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

export const SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN: IEJOptionNode[] = [
  {
    id: 'basic-information',
    text: 'basic information',
  },
  {
    id: 'management-information',
    text: 'management information',
  },
  {
    id: 'risk-acceptance-criteria',
    text: 'risk acceptance criteria',
  },
  {
    id: 'loan-facility-detail',
    text: 'loan facility detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'exposure',
    text: 'exposure',
  },
  {
    id: 'business-activity',
    text: 'business activity',
  },

  {
    ...BASIC_SUBMENU_CREDITPROPOSAL[7],
  },

  {
    id: 'group-guarantour-analyst',
    text: 'group & guarantor analyst',
  },
  {
    id: 'slik-checking',
    text: 'SLIK checking',
  },
  {
    id: 'bank-account-analyst',
    text: 'bank account analysis',
  },
  {
    id: 'credit-rating',
    text: 'credit rating',
  },
  {
    id: 'trade-checking',
    text: 'trade checking',
  },
  {
    id: 'propose-pricing',
    text: 'propose pricing',
  },
  {
    id: 'convenant-tbo',
    text: 'covenant & TBO',
  },
  {
    id: 'summary',
    text: 'summary',
  },
];

export const SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN: object[] = [
  {
    id: 'basic-information',
    text: 'basic information',
  },
  {
    id: 'management-information',
    text: 'management information',
  },
  {
    id: 'risk-acceptance-criteria',
    text: 'risk acceptance criteria',
  },
  {
    id: 'loan-facility-detail',
    text: 'loan facility detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'exposure',
    text: 'exposure',
  },
  {
    id: 'business-activity',
    text: 'business activity',
  },
  {
    ...BASIC_SUBMENU_CREDITPROPOSAL[7],
  },

  {
    id: 'repayment-capability',
    text: 'repayment capability',
  },
  {
    id: 'slik-checking',
    text: 'SLIK checking',
  },
  {
    id: 'bank-account-analyst',
    text: 'bank account analysis',
  },
  {
    id: 'trade-checking',
    text: 'trade checking',
  },
  {
    id: 'propose-pricing',
    text: 'propose pricing',
  },
  {
    id: 'convenant-tbo',
    text: 'covenant & TBO',
  },
  {
    id: 'summary',
    text: 'summary',
  },
];

export const SUBMENU_CREDITPROPOSAL_BACK_TO_BACK: object[] = [...BASIC_SUBMENU_CREDITPROPOSAL];

// Submenu loan analyst

export const SUBMENU_LOAN_ANALYS: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'group-guarantor-analyst',
        text: 'group & guarantor analyst',
      },
      {
        id: 'slik-summary',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'loan-slik-checking',
    text: 'SLIK Checking',
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  // {
  //   id: 'compliance-recommendation',
  //   text: 'Compliance Recommendation',
  // },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const SUBMENU_LOAN_ANALYS_BELOW_AND_BTB: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'slik-summary',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'loan-slik-checking',
    text: 'SLIK Checking',
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  // {
  //   id: 'compliance-recommendation',
  //   text: 'Compliance Recommendation',
  // },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const SUBMENU_LOAN_ANALYS_CP_SUMMARY: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'group-guarantor-analyst',
        text: 'group & guarantor analyst',
      },
      {
        id: 'slik-checking',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

export const SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'slik-checking',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      // {
      //   id: 'credit-rating',
      //   text: 'credit rating',
      // },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

// Loan Approval
export const SUBMENU_LOAN_ANALYS_CP_SUMMARY_BTB: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'slik-summary',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

export const SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'management-information',
        text: 'management information',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'financial-statement',
        text: 'financial statement',
      },
      {
        id: 'slik-checking',
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'repayment-capability',
        text: 'Repayment Capability',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

export const SUBMENU_LOAN_CP: object[] = [
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
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
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

export const SUBMENU_LOAN_DAR: object[] = [
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'slik-summary',
        text: 'SLIK checking',
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
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      // {
      //   id: 'credit-rating',
      //   text: 'credit rating',
      // },
      {
        id: 'trade-checking',
        text: 'Trade Checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
];

export const SUBMENU_LOAN_ANALYS_LA_ANALYST: object[] = [
  ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'loan-slik-checking',
    text: 'SLIK Checking',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

// Loan Analys Approval Menu

export const SUBMENU_LOAN_ANALYS_LA_APPROVAL: object[] = [
  ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
  // ...SUBMENU_LOAN_CP,
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const SUBMENU_LOAN_ANALYS_LA_APPROVAL_BTB: object[] = [
  ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BTB,
  // ...SUBMENU_LOAN_CP,
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const SUBMENU_LOAN_ANALYS_LA_APPROVAL_BELOW: object[] = [
  ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
  // ...SUBMENU_LOAN_CP,
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

// End Loan Analys Approval Menu

export const SUBMENU_LOAN_ANALYS_DAR_FINAL_ABOVE: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'slik-checking',
        text: 'SLIK checking',
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
        id: 'group-guarantor-analyst',
        text: 'Group & Guarantor Analysis',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'Trade Checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'covenant',
    text: 'convenant & Document Checklist',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
];

export const SUBMENU_LOAN_ANALYS_DAR_FINAL: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  ...SUBMENU_LOAN_DAR,
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'covenant',
    text: 'convenant & Document Checklist',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
];

export const SUBMENU_LOAN_ANALYS_DAR_NOTIF_ABOVE: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'slik-checking',
        text: 'SLIK checking',
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
        id: 'group-guarantor-analyst',
        text: 'Group & Guarantor Analysis',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'Trade Checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'dar-convenant',
    text: 'convenant & Document Checklist',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
];

export const SUBMENU_LOAN_COMMITTEE_APPROVAL_ABOVE: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'slik-summary',
        text: 'SLIK checking',
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
        id: 'group-guarantor-analyst',
        text: 'Group & Guarantor Analysis',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'Trade Checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'covenant',
    text: 'convenant & Document Checklist',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
];

export const SUBMENU_LOAN_ANALYS_DAR_CHECKER: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  ...SUBMENU_LOAN_DAR,
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'dar-convenant',
    text: 'Convenant & Document Checklist',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const SUBMENU_LOAN_ANALYS_DAR_CHECKER_BELOW: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'slik-summary',
        text: 'SLIK checking',
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
        id: 'repayment-capability',
        text: 'repayment capability',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'trade-checking',
        text: 'Trade Checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'dar-convenant',
    text: 'Convenant & Document Checklist',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const SUBMENU_LOAN_ANALYS_DAR_CHECKER_ABOVE: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },
      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
      },
      {
        id: 'slik-summary',
        text: 'SLIK checking',
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
        id: 'group-guarantor-analyst',
        text: 'Group & Guarantor Analysis',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'credit-rating',
        text: 'credit rating',
      },
      {
        id: 'trade-checking',
        text: 'Trade Checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'dar-convenant',
    text: 'Convenant & Document Checklist',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const SUBMENU_LOAN_ANALYS_LA_KOMITE: object[] = [
  ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
  ...SUBMENU_LOAN_CP,
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'covenant',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
];

export const SUBMENU_LOAN_ANALYS_LA_KOMITE_BELOW_AND_BTB: object[] = [
  ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
  ...SUBMENU_LOAN_CP,
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'loan-facility-detail',
    text: 'Loan Facility Detail',
  },
  {
    id: 'dar-convenant',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Mapping Facility',
  },
];

export const SUBMENU_LOAN_ANALYS_CC_CHECKING: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'loan-facility-view',
    text: 'Loan Facility Detail',
  },
  {
    id: 'dar-convenant',
    text: 'Covenant & Document Checklist',
  },
];

export const SUBMENU_LOAN_ANALYS_CC_REVIEW: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'loan-facility-view',
    text: 'Loan Facility Detail',
  },
  {
    id: 'dar-convenant',
    text: 'Covenant & Document Checklist',
  },
];

export const SUBMENU_LOAN_ANALYS_APPROVAL_MONITORING: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  ...SUBMENU_LOAN_DAR,
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'loan-facility-detail',
    text: 'loan facility detail',
  },
  {
    id: 'convenant-tbo',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'facility-mapping',
    text: 'Collateral Facility Mapping',
  },
];

export const SUBMENU_OFFERING_LETTER: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'offering-letter',
    text: 'Offering Letter',
  },
  {
    id: 'compliance-recomendation',
    text: 'Compliance Recomendation',
  },
  {
    id: 'decision-approval-report',
    text: 'Decision Approval Report',
    child: [
      {
        id: 'credit-opinion',
        text: 'Credit Opinion',
      },
      {
        id: 'loan-facility-detail',
        text: 'Loan Facility Detail',
      },
      {
        id: 'covenant-document-check',
        text: 'Covenant & Document Checklist',
      },
      {
        id: 'dec-collateral-info',
        text: 'Collateral Info',
      },
      // {
      //   id: 'collateral-facility-mapping',
      //   text: 'Collateral Facility Mapping',
      // },
    ],
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },

      {
        id: 'business-activity',
        text: 'business activity',
      },

      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
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
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },

      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'compare-approval-report',
    text: 'Compare Decision Approval Report',
  },
];

export const SUBMENU_OFFERING_LETTER_BELOW: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'offering-letter',
    text: 'Offering Letter',
  },
  {
    id: 'compliance-recomendation',
    text: 'Compliance Recomendation',
  },
  {
    id: 'decision-approval-report',
    text: 'Decision Approval Report',
    child: [
      {
        id: 'credit-opinion',
        text: 'Credit Opinion',
      },
      {
        id: 'loan-facility-detail',
        text: 'Loan Facility Detail',
      },
      {
        id: 'covenant-document-check',
        text: 'Covenant & Document Checklist',
      },
      {
        id: 'dec-collateral-info',
        text: 'Collateral Info',
      },
      // {
      //   id: 'collateral-facility-mapping',
      //   text: 'Collateral Facility Mapping',
      // },
    ],
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
      {
        id: 'basic-information',
        text: 'basic information',
      },

      {
        id: 'business-activity',
        text: 'business activity',
      },
      {
        id: 'repayment-capability',
        text: 'repayment capability',
      },
      {
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
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
        text: 'SLIK checking',
      },
      {
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'trade-checking',
        text: 'trade checking',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'compare-approval-report',
    text: 'Compare Decision Approval Report',
  },
];

export const SUBMENU_OFFERING_LETTER_FINALIZE: object[] = [
  {
    id: 'credit-proposal-summary',
    text: 'Credit Proposal Summary',
  },
  {
    id: 'offering-letter',
    text: 'Offering Letter',
  },
  {
    id: 'compliance-recomendation',
    text: 'Compliance Recomendation',
  },
  {
    id: 'decision-approval-report',
    text: 'Decision Approval Report',
    child: [
      {
        id: 'credit-opinion',
        text: 'Credit Opinion',
      },
      {
        id: 'loan-facility-detail',
        text: 'Loan Facility Detail',
      },
      {
        id: 'finalize-convenant',
        text: 'Covenant & Document Checklist',
      },
      {
        id: 'dec-collateral-info',
        text: 'Collateral Info',
      },
      // {
      //   id: 'collateral-facility-mapping',
      //   text: 'Collateral Facility Mapping',
      // },
    ],
  },
  {
    id: 'credit-proposal',
    text: 'Credit Proposal',
    child: [
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
        id: 'loan-facility',
        text: 'Loan Facility Detail',
      },
      {
        id: 'exposure',
        text: 'Exposure',
      },
      {
        id: 'risk-acceptance-criteria',
        text: 'risk acceptance criteria',
      },
      {
        id: 'collateral-info',
        text: 'Collateral Info',
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
        id: 'bank-account-analyst',
        text: 'bank account analysis',
      },
      {
        id: 'propose-pricing',
        text: 'propose pricing',
      },
      {
        id: 'convenant-tbo',
        text: 'covenant & TBO',
      },
      {
        id: 'summary',
        text: 'Summary',
      },
    ],
  },
  {
    id: 'compare-approval-report',
    text: 'Compare Decision Approval Report',
  },
];

export const OFFERING_LETTER_SURVEY_BATCH: object[] = [
  {
    id: '',
    label: 'Appraisal Distribution External',
  },
  {
    id: 'offering-letter',
    label: 'Offering Letter',
  },
  {
    id: 'survey-batch',
    label: 'Batch KJPP',
  },
];

export const SUBMENU_SURVEY_BATCH_COLLATERAL_APPRAISAL: IOptionNode[] = [
  {
    id: 'appraisal-info',
    label: 'appraisal info',
  },
  {
    id: 'customer-info',
    label: 'customer info',
  },
  {
    id: 'collateral-info',
    label: 'collateral info',
  },
  {
    id: 'report-independent',
    label: 'Report Independent',
  },
];

export const EMPLOYEE: object[] = [
  {
    id: '',
    label: 'Employee',
  },
  {
    id: 'role',
    label: 'Position',
  },
];

export const DELEGATION: object[] = [
  {
    id: 'delegation-appraisal',
    label: 'Delegation Appraisal',
  },
  {
    id: 'delegation-application',
    label: 'Delegaition Application',
  },
];
export const BASIC_SUBMENU_CREDITAGREEMENT_MEMO: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'memo-banding',
    text: 'Memo Banding',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'finalize-credit-agreement',
    text: 'Finalize Credit Agreement',
  },
];

export const BASIC_SUBMENU_CREDITAGREEMENT: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'finalize-credit-agreement',
    text: 'Finalize Credit Agreement',
  },
];

export const BASIC_SUBMENU_CREDITEGREEMENTREVIEW_MEMO: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'memo-banding',
    text: 'Memo Banding',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'finalize-credit-agreement',
    text: 'Finalize Credit Agreement',
  },
];

export const BASIC_SUBMENU_CREDITEGREEMENTREVIEW: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'finalize-credit-agreement',
    text: 'Finalize Credit Agreement',
  },
];

export const DPDL_FINALIZE: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  // {
  //   id: 'approval-sheet-internal-memo',
  //   text: 'Approval Sheet Internal Memo',
  // },
  {
    id: 'legal-document',
    text: 'Legal Document',
  },
];

export const DPDL_FINALIZE_APPEAL: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'memo-banding',
    text: 'Memo Banding',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  // {
  //   id: 'approval-sheet-internal-memo',
  //   text: 'Approval Sheet Internal Memo',
  // },
  {
    id: 'legal-document',
    text: 'Legal Document',
  },
];

export const DAR_REVISION: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const DAR_REVISION_CHECKER: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const DAR_REVISION_APPEAL: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'memo-banding',
    text: 'Memo Banding',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];
export const BASIC_SUBMENU_DPPK_MEMO: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'dppk',
    text: 'DPPK Finalize',
  },
  {
    id: 'insurance-information',
    text: 'Insurance',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'memo-banding',
    text: 'Memo Banding',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  // DPDL-LEGAL-DOCUMENT
  {
    id: 'dpdl',
    text: 'DPDL',
  },
];
export const BASIC_SUBMENU_DPPK: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'dppk',
    text: 'DPPK Finalize',
  },
  {
    id: 'insurance-information',
    text: 'Insurance',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  // DPDL-LEGAL-DOCUMENT
  {
    id: 'dpdl',
    text: 'DPDL',
  },
];
export const BASIC_SUBMENU_DPPK_REVIEW: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'insurance-information',
    text: 'Insurance',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'dppk',
    text: 'DPPK Finalize',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  // DPDL-LEGAL-DOCUMENT
  {
    id: 'dpdl',
    text: 'DPDL',
  },
];

export const BASIC_SUBMENU_DPPK_REVIEW_MEMO: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'insurance-information',
    text: 'Insurance',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'memo-banding',
    text: 'Memo Banding',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  // DPDL-LEGAL-DOCUMENT
  {
    id: 'dpdl',
    text: 'DPDL',
  },
];
export const BASIC_SUBMENU_INSURANCE_CHECKING_MEMO: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'insurance-information',
    text: 'Insurance information',
  },
];
export const BASIC_SUBMENU_REVIEW_INSURANCE_MEMO: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'insurance-information',
    text: 'Insurance information',
  },
];

export const BASIC_SUBMENU_LOAN_OPS_DIST_MEMO: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'dppk',
    text: 'DPPK Finalize',
  },
  {
    id: 'insurance-information',
    text: 'Insurance',
  },
  {
    id: 'dpdl',
    text: 'DPDL',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'memo-banding',
    text: 'Memo Banding',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];
export const BASIC_SUBMENU_LOAN_OPS_DIST: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'dppk',
    text: 'DPPK Finalize',
  },
  {
    id: 'insurance-information',
    text: 'Insurance',
  },
  {
    id: 'dpdl-loan-operation',
    text: 'DPDL',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export const BASIC_SUBMENU_LOAN_OPS_REVIEW_DIST_MEMO: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'dppk',
    text: 'DPPK Finalize',
  },
  {
    id: 'insurance-information',
    text: 'Insurance',
  },
  {
    id: 'dpdl',
    text: 'DPDL',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'memo-banding',
    text: 'Memo Banding',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];
export const BASIC_SUBMENU_LOAN_OPS_REVIEW_DIST: object[] = [
  {
    id: 'dar-summary',
    text: 'DAR Summary',
  },
  {
    id: 'dppk',
    text: 'DPPK Finalize',
  },
  {
    id: 'insurance-information',
    text: 'Insurance',
  },
  {
    id: 'dpdl',
    text: 'DPDL',
  },
  {
    id: 'loan-facility',
    text: 'Loan Facility Detail',
  },
  {
    id: 'collateral-info',
    text: 'collateral info',
  },
  {
    id: 'opinion',
    text: 'Credit Opinion',
  },
  {
    id: 'compliance-recommendation',
    text: 'Compliance Recommendation',
  },
  {
    id: 'covenant-temp',
    text: 'Covenant & Document Checklist',
  },
  {
    id: 'compare-data',
    text: 'Compare Data',
  },
];

export enum DOCUMENT_TYPE_GENERATE_DOCUMENT {
  DAR = 'DOC_GENERATE_DAR',
  CP = 'DOC_GENERATE_CREDIT_PROPOSAL_MARK_II',
  SPPK = 'DOC_GENERATE_SPPK',
}
