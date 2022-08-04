import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-negative-collateral',
  templateUrl: './collateral-appraisal-negative-collateral.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalNegativeCollateralComponent implements OnInit {
  public data: any = [];

  ngOnInit(): void {
    this.data = data;
  }
}

export const data: any = [
  {
    No: 1,
    Criteria: 'Masuk Gang atau lebar jalan < 3 meter.',
    value: '1',
  },
  {
    No: 2,
    Criteria: 'Hasil site visit, survey, trade checking, dan verifikasi perihal usaha debitur ke rumah dan usaha positif.',
    value: '2',
  },
  {
    No: 3,
    Criteria: 'Berada dekat induk gardu listrik atau saluran udara tegangan ekstra tinggi (SUTET) dengan jarak \u{2264} 50 meter.',
    value: '3',
  },
  {
    No: 4,
    Criteria: 'Terkena banjir (hingga masuk ke dalam property/asset yang menjadi jaminan) setiap menjadi hujan besar.',
    value: '4',
  },
  {
    No: 5,
    Criteria: 'Ada rencana tata kota yang akan menyebabkan terjadinya penggusuran property/asset yang menjadi jaminan.',
    value: '5',
  },
  {
    No: 6,
    Criteria:
      'Dijadikan rumah ibadah, sekolah, panti jompo, panti asuhan, rumah duka, rumah sakit atau prasarana lain yang bersifat sosial kemanusiaan.',
    value: '6',
  },
  {
    No: 7,
    Criteria: 'Berlokasi dekat pemakaman umum (berjarak \u{2264} 200 meter).',
    value: '7',
  },
  {
    No: 8,
    Criteria: 'Berlokasi dekat dengan Tempat Pembuangan Sampah Akhir (TPA) dengan jarak \u{2264} 1 km.',
    value: '8',
  },
  {
    No: 9,
    Criteria: 'Diginakan dan atau diperuntukan (zoning) sebagai sawah/ladang/pertanian/rawa-rawa.',
    value: '9',
  },
  {
    No: 10,
    Criteria: 'Jaminan merupakan kawasan cagar budaya.',
    value: '10',
  },
  {
    No: 11,
    Criteria: 'SHM atau HGB atau SHMSRS di atas Hak Pengelolaan.',
    value: '11',
  },
  {
    No: 12,
    Criteria:
      'Sebagian area tanahnya digunakan untuk mendirikan Base Transceiver Station atau BTS (tidak termasuk BTS yang didirikan diatas bangunan).',
    value: '12',
  },
  {
    No: 13,
    Criteria: 'Rumah sarang burung.',
    value: '13',
  },
  {
    No: 14,
    Criteria: 'HGB atau MoU di atas Hak Milik orang lain (Perumnas).',
    value: '14',
  },
  {
    No: 15,
    Criteria: 'Terletak di pinggir laut (bukan pantai) atau rel kereta api.',
    value: '15',
  },
];
