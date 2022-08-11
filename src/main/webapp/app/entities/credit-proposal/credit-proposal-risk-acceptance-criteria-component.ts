import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogComponent, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { ICreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria',
  templateUrl: './credit-proposal-risk-acceptance-criteria-component.html',
  styleUrls: ['./credit-proposal-risk-acceptance-criteria.css'],
})
export class CreditProposalRiskAcceptanceCriteriaComponent implements OnInit {
  public data: Object[];

  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;
  public closeOnEscape: boolean;
  Dialog: any;

  constructor() {
    this.width = '70%';
    this.height = '90%';
    this.dialogVisible = false;
    this.animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public btnAdd(): void {
    this.dialogVisible = true;
  }

  ngOnInit(): void {
    this.data = data;
  }
}
export const data: Object[] = [
  {
    No: 1,
    Parameter: 'Debitur merupakah individu (Perorangan) , warga negara indonesia dan berdomisili indonesia',
    Verified: !0,
    value: 'gang',
  },
  {
    No: 2,
    Parameter: 'Age for individual debtors: Min. 24 years at the time of proposing loan, Max. 65 years at loan maturity date',
    Verified: !2,
    value: 'p',
  },
  {
    No: 3,
    Parameter: 'Business location ≤ 30 KM from Hana Bank branch booking unit',
    Verified: !3,
  },
  {
    No: 4,
    Parameter: 'Is the debtor industry included in the watch list industry?',
    Verified: !4,
  },
  {
    No: 5,
    Parameter: 'Not included in the National Black List (DHN) of Bank Indonesia',
    Verified: !5,
  },
  {
    No: 6,
    Parameter: 'The purpose of applying for credit is not for buying land',
    Verified: !6,
  },
  {
    No: 7,
    Parameter: 'Not a Political Exposed Person (PEP) -> includes spouse, BOD & BOC debtors',
    Verified: !7,
  },
  // {
  //   No: 8,
  //   Parameter: 'Berlokasi dekat dengan Tempat Pembuangan Sampah Akhir (TPA) dengan jarak \u{2264} 1 km.',
  //   Verified: !8,
  // },
  // {
  //   No: 9,
  //   Parameter: 'Diginakan dan atau diperuntukan (zoning) sebagai sawah/ladang/pertanian/rawa-rawa.',
  //   Verified: !9,
  // },
  // {
  //   No: 10,
  //   Parameter: 'Jaminan merupakan kawasan cagar budaya.',
  //   Verified: !10,
  // },
  // {
  //   No: 11,
  //   Parameter: 'SHM atau HGB atau SHMSRS di atas Hak Pengelolaan.',
  //   Verified: !11,
  // },
  // {
  //   No: 12,
  //   Parameter:
  //     'Sebagian area tanahnya digunakan untuk mendirikan Base Transceiver Station atau BTS (tidak termasuk BTS yang didirikan diatas bangunan).',
  //   Verified: !12,
  // },
  // {
  //   No: 13,
  //   Parameter: 'Rumah sarang burung.',
  //   Verified: !13,
  // },
  // {
  //   No: 14,
  //   Parameter: 'HGB atau MoU di atas Hak Milik orang lain (Perumnas).',
  //   Verified: !14,
  // },
  // {
  //   No: 15,
  //   Parameter: 'Terletak di pinggir laut (bukan pantai) atau rel kereta api.',
  //   Verified: !15,
  // },
];
