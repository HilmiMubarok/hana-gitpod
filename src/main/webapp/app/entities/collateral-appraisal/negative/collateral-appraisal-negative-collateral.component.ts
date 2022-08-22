/* import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-negative-collateral',
  templateUrl: './collateral-appraisal-negative-collateral.component.html',
  styleUrls: ['./collateral-appraisal-negative-collateral.css'],
})
export class CollateralAppraisalNegativeCollateralComponent {
  public dialogVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };
  public data: Object[] = [
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

  // Model
  public criteria?: string;

  public onAdd(): void {
    this.dialogVisible = true;
  }

  public onAddToGrid(): void {
    this.data = [
      ...this.data,
      {
        No: this.data.length + 1,
        Criteria: this.criteria,
        value: this.data.length + 1,
      },
    ];

    this.clearTextBox();

    this.dialogVisible = false;
  }

  public clearTextBox(): void {
    this.criteria = '';
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }
}*/

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IScoreCard, ScoreCard } from './score-card.constant';

@Component({
  selector: 'jhi-collateral-appraisal-negative-collateral',
  templateUrl: './collateral-appraisal-negative-collateral.component.html',
  styleUrls: ['./collateral-appraisal-negative-collateral.css'],
})
export class CollateralAppraisalNegativeCollateralComponent {
  @Output()
  public criteriaEvent = new EventEmitter<IScoreCard[]>();

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: IScoreCard[]) {
    this._item = item;
  }

  constructor() {}

  private _item: IScoreCard[];
  public criteria: String = '';
  public dialogVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  public onAdd(): void {
    this.dialogVisible = true;
  }

  public onAddToGrid(): void {
    const newItem: IScoreCard = { id: this.item.length + 1, criteria: this.criteria.toString(), value: 'no' };
    const copyItems: IScoreCard[] = this.item;
    copyItems.push(newItem);

    this.item = [...new Set([...this.item, ...copyItems])];
    this.criteriaEvent.emit(this.item);
    this.clearTextBox();
    this.dialogVisible = false;
  }

  public selectScoreCard(data: IScoreCard, value: string) {
    const idx = this.item
      .map(function (e) {
        return e.id;
      })
      .indexOf(data.id);

    this.item[idx].value = value;
  }

  public clearTextBox(): void {
    this.criteria = '';
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }
}
