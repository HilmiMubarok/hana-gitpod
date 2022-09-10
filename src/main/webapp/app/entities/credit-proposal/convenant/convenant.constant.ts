export interface ICovenant {
  id?: number;
  covenant?: string;
  status?: string;
  deviation?: string;
  justification?: string;
}

export class Covenant implements ICovenant {
  constructor(
    public id?: number,
    public covenant?: string,
    public status?: string,
    public deviation?: string,
    public justification?: string,
    public standardCovenant?: ICovenant[],
    public otherCovenant?: ICovenant[]
  ) {
    this.id = 0;
    (this.covenant = ''), (this.status = '');
    this.deviation = '';
    this.justification = '';
    this.standardCovenant = [];
    this.otherCovenant = [];
  }
}

export const dataCovenant = [
  {
    id: 0,
    covenant:
      'Debitor Wajib mendapatkan persetujuan terlebih dahulu dari BANK sebelum membayar dividen atau melakukan distribusi atas pendapatan lainya kepada pemegang sahamnya.',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 1,
    covenant:
      'Debitor wajib memberikan laporan secara tertulis apabila memperoleh fasilitas kredit / pinjaman dari pihak lain atau kreditur lain kepada bank dan wajib mendapatkan persetujuan terlebih dahulu dari Bank',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 2,
    covenant:
      'DEBITOR wajib memberikan laporan secara tertulis apabila jaminan disewakan kepada pihak ketiga  dan masa jangka waktu sewa yang diperbolehkan adalah maximal 2 (dua) tahun dan wajib mendapatkan persetujuan terlebih dahulu dari BANK.',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 3,
    covenant: 'Wajib menyerahkan copy kontrak dengan penyewa, baik kontrak saat ini maupun setiap perpanjangan nya',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 4,
    covenant:
      'DEBITOR wajib menyalurkan aktivitas keuangan usaha dan aktifitas bertransaksi melalui rekening DEBITOR di BANK min 50% dari total revenue atay secara Prorata (Prorate).',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 5,
    covenant: 'Untuk Fasilitas Kredit berbasis angsuran wajib menempatkan Sinking Fund 1x Installment.',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 6,
    covenant:
      'Bila dikemudian hari terjadi kerugian atau persoalan hukum maupun masalah keuangan  yang dapat mempengaruhi jalannya usaha, khususnya kelancaran pembayaran kewajiban kepada BANK, DEBITOR wajib segera melaporkan secara tertulis kepada BANK, dan secepatnya melakukan tindakan perbaikan.',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 7,
    covenant:
      'Denda atas pelunasan dipercepat dihitung berdasarkan sisa outstanding dari pinjaman berbasis angsuran Pinjaman cicilan sebesar 3% dari pokok yang (akan) dilunasi, dan 2% untuk working capital loan.',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 8,
    covenant:
      'DEBITOR, Direksi dan anggota Dewan Komisaris serta pemegang saham DEBITOR, semua atau masing-masin tidak memiliki sengketa hukum, tunggakan pajak atau kewajiban keuangan lainnya yang dapat mempengaruhi jalannya usaha.',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 9,
    covenant:
      'Khusus Credit take over dari bank lain dengan masa pertanggungan asuransi masih berlaku, debitur dapat menggunakan polis tersebut sampai dengan jatuh tempo dengan kondisi dicantumkan banker’s clause untuk Hana Bank. Polis asli dengan banker’s clause bank wajib diserahkan sebelum akad kredit untuk perusahaan asuransi yang menjadi rekanan bank dan max. H+14 untuk asuransi non rekanan. Apabila hingga sampai dengan H+14, polis asli dengan banker’s clause Hana Bank belum diserahkan, maka fasilitas kredit debitur harus di freeze.',
    status: '',
    deviation: '',
    justification: '',
  },
  {
    id: 10,
    covenant:
      'Sebelum akad kredit, penutupan asuransi atas agunan tetap wajib dilakukan dengan tanggal efektif sejak jatuh tempo polis dari bank asal berakhir sampai dengan tahun berikutnya perusahaan asuransi rekanan bank.',
    status: '',
    deviation: '',
    justification: '',
  },
];
