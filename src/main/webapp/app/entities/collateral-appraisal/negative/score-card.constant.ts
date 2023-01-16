export interface IScoreCard {
  id?: number;
  criteria?: string;
  value?: string;
}

export class ScoreCard {
  constructor(public id?: number, public criteria?: string, public value?: string) {}
}

export const scoreCard: IScoreCard[] = [
  {
    id: 1,
    criteria: 'Masuk Gang atau lebar jalan < 3 meter.',
    value: 'no',
  },
  {
    id: 2,
    criteria: 'Hasil site visit, survey, trade checking, dan verifikasi perihal usaha debitur ke rumah dan usaha positif.',
    value: 'no',
  },
  {
    id: 3,
    criteria: 'Berada dekat induk gardu listrik atau saluran udara tegangan ekstra tinggi (SUTET) dengan jarak \u{2264} 50 meter.',
    value: 'no',
  },
  {
    id: 4,
    criteria: 'Terkena banjir (hingga masuk ke dalam property/asset yang menjadi jaminan) setiap menjadi hujan besar.',
    value: 'no',
  },
  {
    id: 5,
    criteria: 'Ada rencana tata kota yang akan menyebabkan terjadinya penggusuran property/asset yang menjadi jaminan.',
    value: 'no',
  },
  {
    id: 6,
    criteria:
      'Dijadikan rumah ibadah, sekolah, panti jompo, panti asuhan, rumah duka, rumah sakit atau prasarana lain yang bersifat sosial kemanusiaan.',
    value: 'no',
  },
  {
    id: 7,
    criteria: 'Berlokasi dekat pemakaman umum (berjarak \u{2264} 200 meter).',
    value: 'no',
  },
  {
    id: 8,
    criteria: 'Berlokasi dekat dengan Tempat Pembuangan Sampah Akhir (TPA) dengan jarak \u{2264} 1 km.',
    value: 'no',
  },
  {
    id: 9,
    criteria: 'Diginakan dan atau diperuntukan (zoning) sebagai sawah/ladang/pertanian/rawa-rawa.',
    value: 'no',
  },
  {
    id: 10,
    criteria: 'Jaminan merupakan kawasan cagar budaya.',
    value: 'no',
  },
  {
    id: 11,
    criteria: 'SHM atau HGB atau SHMSRS di atas Hak Pengelolaan.',
    value: 'no',
  },
  {
    id: 12,
    criteria:
      'Sebagian area tanahnya digunakan untuk mendirikan Base Transceiver Station atau BTS (tidak termasuk BTS yang didirikan diatas bangunan).',
    value: 'no',
  },
  {
    id: 13,
    criteria: 'Rumah sarang burung.',
    value: 'no',
  },
  {
    id: 14,
    criteria: 'HGB atau MoU di atas Hak Milik orang lain (Perumnas).',
    value: 'no',
  },
  {
    id: 15,
    criteria: 'Terletak di pinggir laut (bukan pantai) atau rel kereta api.',
    value: 'no',
  },
];
