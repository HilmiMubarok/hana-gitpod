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

export enum BLOOD_TYPE {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
  NA = 'NOT AVAILABLE',
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
