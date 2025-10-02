export interface ICovenant {
  id?: number;
  covenant?: string;
  status?: string;
  deviation?: string;
  justification?: string;
  otherCovenant?: any;
  formGroub?: boolean;
}

export class Covenant implements ICovenant {
  constructor(
    public id?: number,
    public covenant?: string,
    public status?: string,
    public deviation?: string,
    public justification?: string,
    public standardCovenant?: ICovenant[],
    public standardDataGridAbove?: ICovenant[],
    public standardDataGridBackToBackDeposit?: ICovenant[],
    public standardDataGridBackToBackGeneral?: ICovenant[],
    public otherCovenant?: any
  ) {
    this.id = 0;
    this.covenant = '';
    this.deviation = '';
    this.justification = '';
    (this.status = 'Applied'), (this.otherCovenant = []);
    this.standardCovenant = [];
    this.standardDataGridAbove = [];
    this.standardDataGridBackToBackDeposit = [];
    this.standardDataGridBackToBackGeneral = [];
  }
}

export const dataCovenantBelow = [
  {
    id: 0,
    covenant:
      'DEBITOR wajib secara berkala menyampaikan laporan keuangan usaha intern selambat-lambatnya 90 (sembilanpuluh) hari setelah berakhirnya periode laporan keuangan serta Laporan Keuangan 1 usaha audited selambat-lambatnya 270 (duaratus tujuhpuluh) hari sejak tanggal penutupan tahun buku dan sewaktu-waktu bila dianggap perlu oleh BANK, DEBITOR bersedia memberikan data/ informasi usaha terkini termasuk data-data mutasi rekening koran pada BANK atau bank lain.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 1,
    covenant:
      'DEBITOR wajib mendapatkan persetujuan terlebih dahulu dari BANK sebelum membayar dividen 2 atau melakukan distribusi atas pendapatan lainnya kepada pemegang sahamnya.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 2,
    covenant:
      'DEBITOR wajib memberikan laporan secara tertulis apabila memperoleh fasilitas kredit / pinjaman 3 dari pihak lain atau kreditur lain kepada BANK dan wajib mendapatkan persetujuan terlebih dahulu dari Bank',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 3,
    covenant:
      'a.DEBITOR wajib memberikan laporan secara tertulis apabila jaminan disewakan kepada pihak ketiga dan masa jangka waktu sewa yang diperbolehkan adalah maximal 2 (dua) tahun dan wajib mendapatkan persetujuan terlebih dahulu dari BANK. b. Wajib menyerahkan copy kontrak dengan penyewa, baik kontrak saat ini maupun setiap perpanjangannya ',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 4,
    covenant:
      'DEBITOR wajib menyalurkan aktivitas keuangan usaha dan aktifitas bertransaksi melalui rekening DEBITOR di BANK min 50% dari total revenue atau secara Prorata (Prorate).',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 5,
    covenant: 'Untuk Fasilitas Kredit berbasis angsuran wajib menempatkan Sinking Fund 1x Installment.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 6,
    covenant:
      'Bila dikemudian hari terjadi kerugian atau persoalan hukum maupun masalah keuangan  yang dapat mempengaruhi jalannya usaha, khususnya kelancaran pembayaran kewajiban kepada BANK, DEBITOR wajib segera melaporkan secara tertulis kepada BANK, dan secepatnya melakukan tindakan perbaikan.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 7,
    covenant:
      'Denda atas pelunasan dipercepat dihitung berdasarkan sisa outstanding dari pinjaman berbasis angsuran Pinjaman cicilan sebesar 3% dari pokok yang (akan) dilunasi, dan 2% untuk working capital loan.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 8,
    covenant:
      'DEBITOR, Direksi dan anggota Dewan Komisaris serta pemegang saham DEBITOR, semua atau masing-masing tidak memiliki sengketa hukum, tunggakan pajak atau kewajiban keuangan lainnya yang dapat mempengaruhi jalannya usaha.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 9,
    covenant:
      'a. Khusus Credit take over dari bank lain dengan masa pertanggungan asuransi masih berlaku, debitur dapat menggunakan polis tersebut sampai dengan jatuh tempo dengan kondisi dicantumkan banker’s clause untuk Hana Bank. Polis asli dengan banker’s clause bank wajib diserahkan sebelum akad kredit untuk perusahaan asuransi yang menjadi rekanan bank dan max. H+14 untuk asuransi non rekanan. Apabila hingga sampai dengan H+14, polis asli dengan banker’s clause Hana Bank belum diserahkan, maka fasilitas kredit debitur harus di freeze. b. Sebelum akad kredit, penutupan asuransi atas agunan tetap wajib dilakukan dengan tanggal efektif sejak jatuh tempo polis dari bank asal berakhir sampai dengan tahun berikutnya perusahaan asuransi rekanan bank.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
];

export const dataCovenantAbove = [
  {
    id: 0,
    covenant:
      'DEBITOR wajib secara berkala menyampaikan laporan keuangan usaha intern selambat-lambatnya 90 (sembilanpuluh) hari setelah berakhirnya periode laporan keuangan serta Laporan Keuangan usaha audited selambat-lambatnya 270 (seratus delapanpuluh) hari sejak tanggal penutupan tahun buku dan sewaktu-waktu bila dianggap perlu oleh BANK, DEBITOR bersedia memberikan data / informasi usaha terkini termasuk data-data mutasi rekening koran pada BANK atau bank lain.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 1,
    covenant:
      'DEBITOR wajib mendapatkan persetujuan terlebih dahulu dari BANK sebelum membayar dividen atau melakukan distribusi atas pendapatan lainnya kepada pemegang sahamnya',
    status: 'Applied',

    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 2,
    covenant:
      'DEBITOR wajib memberikan laporan secara tertulis apabila jaminan disewakan kepada pihak ketiga dan masa jangka waktu sewa yang diperbolehkan adalah maximal 2 (dua) tahun dan wajib mendapatkan persetujuan terlebih dahulu dari BANK',
    status: 'Applied',

    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 3,
    covenant:
      'DEBITOR wajib menyalurkan aktivitas keuangan usaha dan aktifitas bertransaksi melalui rekening DEBITOR di BANK min 50% dari total revenue atau secara Prorata (Prorate).',
    status: 'Applied',

    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 4,
    covenant:
      'Bila dikemudian hari terjadi kerugian atau persoalan hukum maupun masalah keuangan yang dapat mempengaruhi jalannya usaha, khususnya kelancaran pembayaran kewajiban kepada BANK, DEBITOR wajib segera melaporkan secara tertulis kepada BANK, dan secepatnya melakukan tindakan perbaikan.',
    status: 'Applied',

    deviation: '',
    justification: '',
    formGroub: false,
  },
  // {
  //   id: 5,
  //   covenant:
  //     'DEBITOR wajib mendapatkan persetujuan terlebih dahulu dari BANK sebelum membayar dividen atau melakukan distribusi atas pendapatan lainnya kepada pemegang sahamnya',
  //   status: 'Applied',

  //   deviation: '',
  //   justification: '',
  //   formGroub: false,
  // },
  {
    id: 5,
    covenant:
      'DEBITOR wajib memberikan laporan secara tertulis apabila memperoleh fasilitas kredit / pinjaman dari pihak lain atau kreditur lain kepada BANK dan wajib mendapatkan persetujuan terlebih dahulu dari BANK',
    status: 'Applied',

    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 6,
    covenant:
      'DEBITOR, Direksi dan anggota Dewan Komisaris serta pemegang saham DEBITOR, semua atau masing-masing tidak memiliki sengketa hukum, tunggakan pajak atau kewajiban keuangan lainnya yang dapat mempengaruhi jalannya usaha.',
    status: 'Applied',

    deviation: '',
    justification: '',
    formGroub: false,
  },
];

export const dataCovenantBackToBackDeposit = [
  {
    id: 0,
    covenant:
      'If there are more than one guaranteed deposit, the maturity and all conditions of the guaranteed deposit must be uniform. (For interest rates based on Spreads)',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 1,
    covenant:
      'For working capital facilities with a term of 1 (one) year, the minimum deposit period is the same as the credit facility period and For the term loan structure, the minimum deposit period is 12 (twelve) months and automatically extended (ARO) for a minimum of principal and/or or a minimum deposit period equal to the term of the credit facility.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 2,
    covenant: 'Guaranteed deposit funds may not come from the loan disbursement fund.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 3,
    covenant: 'Deposit placement must be done all at once and should not be done in stages7',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
];

export const dataCovenantBackToBackGeneral = [
  {
    id: 0,
    covenant: 'Back to back loan must be recorded at the same branch where the deposit/giro/savings account is placed.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 1,
    covenant:
      'In the event of default or arrears, the collateral will be disbursed to pay off all arrears or all facilities no later than 7 (seven) working days after the arrears occurred.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 2,
    covenant:
      'If the Rupiah exchange rate reaches Rp. …………. or higher or collateral coverage reaches 105% (whichever comes first), the debtor must top up the collateral in the form of a minimum deposit/savings/giro of Rp…………………………. no later than 1 (one) working day after notification from the Bank. If the top up is not done, the Bank will convert the loan into rupiah currency according to the exchange rate prevailing at the time of conversion (this clause is for the currency of the loan and collateral, where the currency of the loan is stronger than the currency of the guarantee).',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 3,
    covenant: 'Early repayment is subject to a 0.25% penalty from the credit limit.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
  {
    id: 4,
    covenant:
      'If the payment is made using the guarantee fund, there will still be a penalty fee of 0.25% and the current interest on the deposit is not paid.',
    status: 'Applied',
    deviation: '',
    justification: '',
    formGroub: false,
  },
];

export const statusCovenantNotRefreshedFromMaster = [
  'CP_APPROVE_TO_LA',
  'CP_LOAN_APPROVAL',
  'CP_ASSIGNMENT',
  'CP_CHECKER',
  'CP_DAR_CHECKER',
  'CP_COMPLETE',
  'LA_DAR_NOTIF',
  'CP_CC_DISTRIBUTION',
  'CP_CC_ANALYST',
  'CP_CC_REVIEW',
  'CP_CC_DEPT_HEAD',
  'CP_CC_DIRECTOR',
  'CP_CC_DIV_HEAD',
  'OL_FINALIZE',
  'OL_ASSIGNED',
  'OL_COMPLETE',
  'OL_REVIEW_HEAD',
  'OL_REVIEW_LEAD',
  'OL_REVIEW_TEAMLEAD',
  'OL_CANCEL',
  'DAR_CANCEL',
  'OL_CONFIRMATION',
  'APPROVAL_CREDIT_DIRECTOR',
  'APPROVAL_FINANCE_DIRECTOR',
  'APPROVAL_HEAD_OF_BUSINESS_DIRECTOR',
  'APPROVAL_HEAD_OF_CREDIT_REVIEW_1',
  'APPROVAL_HEAD_OF_CREDIT_REVIEW_2',
  'APPROVAL_HEAD_OF_SME_CHECKER_1',
  'APPROVAL_HEAD_OF_SME_CHECKER_2',
  'DPDL_FINALIZE',
  'DPDL_REVIEW_HEAD',
  'DPDL_REVIEW_LEAD',
  'DPDL_REVIEW_TEAMLEAD',
  'DPPK_FINALIZE',
  'DPPK_REVIEW',
  'DPPK_REVIEW_CHECKER1',
  'DPPK_REVIEW_CHECKER2',
  'LOAN_OPS_CHECKING',
  'LOAN_OPS_REVIEW',
  'PK_DAR_REVISION',
  'PK_DAR_REVISION_CHECKER',
  'PK_FINALIZE',
  'PK_GENERATED',
  'PK_RETURN_TO_OL',
  'PK_REVIEW_LEAD',
  'PK_REVIEW_TEAMLEAD',
  'LOAN_OPS_DISTRIBUTION',
  'INSURANCE_CANCEL',
  'INSURANCE_CHECKER',
  'INSURANCE_CHECKING',
  'INSURANCE_COMPLETE',
  'INSURANCE_REVIEW',
  'INSURANCE_WAITING',
];