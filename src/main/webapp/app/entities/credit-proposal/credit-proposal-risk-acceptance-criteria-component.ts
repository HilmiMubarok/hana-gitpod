import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DialogComponent, DialogUtility } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria',
  templateUrl: './credit-proposal-risk-acceptance-criteria-component.html',
  styleUrls: ['./credit-proposal-risk-acceptance-criteria.css'],
})
export class CreditProposalRiskAcceptanceCriteriaComponent implements OnInit {
  public data: Object[];

  // public onOpenDialog = (event: any): void => {
  //   DialogUtility.alert({
  //     title: 'Alert Dialog',
  //     content: 'This is an Alert Dialog!',
  //     okButton: { text: 'OK', click: this.okClick.bind(this) },
  //     showCloseIcon: true,
  //     closeOnEscape: true,
  //     animationSettings: { effect: 'Zoom' },
  //   });
  // };
  // private okClick(): void {
  //   alert('you clicked OK button');
  // }
  ngOnInit(): void {
    this.data = data;
  }

  @ViewChild('Dialog')
  public Dialog: DialogComponent;
  public showCloseIcon: Boolean = true;
  public width: '30%';
  public animationSettings: Object = { effect: 'None' };
  public header: 'Low Battery';
  BtnClick() {
    this.Dialog.show();
  }
  dialogClose() {
    document.getElementById('dlgbtn').style.display = 'block';
  }
  // On Dialog open, 'Open' Button will be hidden
  dialogOpen() {
    document.getElementById('dlgbtn').style.display = 'none';
  }
  public dlgButtons: Object[] = [
    {
      click: this.dlgBtnClick.bind(this),
      buttonModel: { content: 'OK', isPrimary: 'true' },
    },
    { click: this.dlgBtnClick.bind(this), buttonModel: { content: 'Cancel' } },
  ];

  dlgBtnClick() {
    this.Dialog.hide();
  }
}
export const data: Object[] = [
  {
    No: 1,
    Parameter: 'Masuk Gang atau lebar jalan < 3 meter.',
    Verified: !0,
    value: 'gang',
  },
  {
    No: 2,
    Parameter: 'Hasil site visit, survey, trade checking, dan verifikasi perihal usaha debitur ke rumah dan usaha positif.',
    Verified: !2,
    value: 'p',
  },
  {
    No: 3,
    Parameter: 'Berada dekat induk gardu listrik atau saluran udara tegangan ekstra tinggi (SUTET) dengan jarak \u{2264} 50 meter.',
    Verified: !3,
  },
  {
    No: 4,
    Parameter: 'Terkena banjir (hingga masuk ke dalam property/asset yang menjadi jaminan) setiap menjadi hujan besar.',
    Verified: !4,
  },
  {
    No: 5,
    Parameter: 'Ada rencana tata kota yang akan menyebabkan terjadinya penggusuran property/asset yang menjadi jaminan.',
    Verified: !5,
  },
  {
    No: 6,
    Parameter:
      'Dijadikan rumah ibadah, sekolah, panti jompo, panti asuhan, rumah duka, rumah sakit atau prasarana lain yang bersifat sosial kemanusiaan.',
    Verified: !6,
  },
  {
    No: 7,
    Parameter: 'Berlokasi dekat pemakaman umum (berjarak \u{2264} 200 meter).',
    Verified: !7,
  },
  {
    No: 8,
    Parameter: 'Berlokasi dekat dengan Tempat Pembuangan Sampah Akhir (TPA) dengan jarak \u{2264} 1 km.',
    Verified: !8,
  },
  {
    No: 9,
    Parameter: 'Diginakan dan atau diperuntukan (zoning) sebagai sawah/ladang/pertanian/rawa-rawa.',
    Verified: !9,
  },
  {
    No: 10,
    Parameter: 'Jaminan merupakan kawasan cagar budaya.',
    Verified: !10,
  },
  {
    No: 11,
    Parameter: 'SHM atau HGB atau SHMSRS di atas Hak Pengelolaan.',
    Verified: !11,
  },
  {
    No: 12,
    Parameter:
      'Sebagian area tanahnya digunakan untuk mendirikan Base Transceiver Station atau BTS (tidak termasuk BTS yang didirikan diatas bangunan).',
    Verified: !12,
  },
  {
    No: 13,
    Parameter: 'Rumah sarang burung.',
    Verified: !13,
  },
  {
    No: 14,
    Parameter: 'HGB atau MoU di atas Hak Milik orang lain (Perumnas).',
    Verified: !14,
  },
  {
    No: 15,
    Parameter: 'Terletak di pinggir laut (bukan pantai) atau rel kereta api.',
    Verified: !15,
  },
];
