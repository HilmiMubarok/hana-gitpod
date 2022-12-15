import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { PositionService } from 'app/entities/position/position.service';
import { IComplienceReccomendation } from './complience.model';

@Component({
  selector: 'jhi-loan-analys-compliance',
  templateUrl: './loan-analys-compliance.component.html',
  styleUrls: ['./compliance-recommendation.css'],
})
export class LoanAnalysComplianceComponent implements OnInit {
  public regulation: string;
  public value: string;
  public criteria: string;
  public remarks?: any = [];
  public attributes: any;
  public _creditProposal: ICreditProposal;
  public data: Object[];
  private id: number;
  public analystRecommendation: string;
  public route: any;
  public view: boolean;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }
  constructor(
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.view = false;
  }

  public onSelect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataCompliance[data.No - 1].value = value;
    this.creditProposal.attributes['complienceReccomendation'].complienceRec = this.dataCompliance;
  }

  // ini bisa
  onKeyUpEvent() {
    for (let h = 0; h < this.dataCompliance.length; h++) {
      this.dataCompliance[h].remarks = this.remarks[h];
    }

    this.creditProposal.attributes['complienceReccomendation'].remarks = this.dataCompliance;
  }

  // for grid one
  public dataCompliance = [
    {
      No: 1,
      regulation: 'Ketersediaan Laporan keuangan',
      criteria: 'Audited (asset/sales > Rp 50 bio atau merupakan perusahaan terbuka)',
      value: '',
      remarks: '',
    },
    {
      No: 2,
      regulation: 'Ketersediaan Laporan keuangan',
      criteria: 'Inhouse Long Form (Rp 25 bio < asset/sales < Rp 50 bio)',
      value: '',
      remarks: '',
    },
    {
      No: 3,
      regulation: 'Ketersediaan Laporan keuangan',
      criteria: 'Inhouse Short Form (asset/sales < Rp 25 bio)',
      value: '',
      remarks: '',
    },
    {
      No: 4,
      regulation: 'Ketersediaan Laporan keuangan',
      criteria: 'Khusus debitur Yayasan Audited (asset/kekayaan di luar harta wakaf ≥ Rp 20 bio)',
      value: '',
      remarks: '',
    },
    {
      No: 5,
      regulation: 'Batas Maksimum Pemberian Kredit (BMPK)',
      criteria:
        'Pihak Terkait BMPK sebesar 10% dari Total Modal Bank Terdapat Persetujuan Dewan Komisaris Bank (Khusus untuk penyediaan dana kepada Pihak Terkait) ',
      value: '',
      remarks: '',
    },
    {
      No: 6,
      regulation: 'Batas Maksimum Pemberian Kredit (BMPK)',
      criteria: 'Pihak Tidak Terkait - Individu BMPK sebesar 25% dari Modal Inti Bank',
      value: '',
      remarks: '',
    },
    {
      No: 7,
      regulation: 'Batas Maksimum Pemberian Kredit (BMPK)',
      criteria: 'Pihak Tidak Terkait - Group BMPK sebesar 25% dari Modal Inti Bank',
      value: '',
      remarks: '',
    },
    {
      No: 8,
      regulation: 'Batas Maksimum Pemberian Kredit (BMPK)',
      criteria: 'BUMN BMPK sebesar 30% dari Total Modal Bank',
      value: '',
      remarks: '',
    },
    {
      No: 9,
      regulation: 'Batas Maksimum Pemberian Kredit (BMPK)',
      criteria: 'Jaminan',
      value: '',
      remarks: '',
    },
    {
      No: 10,
      regulation: 'Tujuan Penggunaan Kredit',
      criteria:
        'Bukan untuk jual beli saham kepada orang perorang atau perusahaan yang bukan perusahaan efek ' +
        'dan tidak melampaui persentasi jumlah pemberian kredit sebagaimana ketentuan POJK No.40/POJK.03/2017 tentang ' +
        'Kredit atau Pembiayaan kepada Perusahaan Efek dan Kredit atau Pembiayaan dengan Agunan Saham',
      value: '',
      remarks: '',
    },
    {
      No: 11,
      regulation: 'Tujuan Penggunaan Kredit',
      criteria: 'Bukan untuk pemberian kredit kepada Pihak Asing',
      value: '',
      remarks: '',
    },
    {
      No: 12,
      regulation: 'Tujuan Penggunaan Kredit',
      criteria: 'Bukan Termasuk kredit Negatif/Macet',
      value: '',
      remarks: '',
    },
    {
      No: 13,
      regulation: 'Tujuan Penggunaan Kredit',
      criteria: 'Bukan untuk transaksi derivatif',
      value: '',
      remarks: '',
    },
    {
      No: 14,
      regulation: 'Tujuan Penggunaan Kredit',
      criteria: 'Bukan untuk membiayai margin deposit',
      value: '',
      remarks: '',
    },
    {
      No: 15,
      regulation: 'Tujuan Penggunaan Kredit',
      criteria:
        'Bukan untuk pengadaan dan/atau pengolahan tanah kepada pengembang baik langsung maupun tidak langsung, ' +
        'pengecualian berlaku hanya sebagaimana ketentuan POJK No.44/POJK.03/2017 tentang Pembatasan Pemberian Kredit ' +
        'atau Pembiayaan oleh Bank Umum untuk Pengadaan tanah dan/atau Pengolahan Tanah dan perubahannya',
      value: '',
      remarks: '',
    },
  ];

  ngOnInit(): void {
    if (this.creditProposal.attributes['complienceReccomendation'].complienceRec.length !== 0) {
      for (let i = 0; i < this.creditProposal.attributes['complienceReccomendation'].complienceRec.length; i++) {
        this.dataCompliance = this.creditProposal.attributes['complienceReccomendation'].complienceRec;
        this.remarks[i] = this.creditProposal.attributes['complienceReccomendation'].complienceRec[i].remarks;
      }
    }
    this.disabledOffering();
    this.remaksCondition();
    this.conditionDisableCompliance();
  }

  public test() {}
  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
  };

  public remaksCondition() {
    if (this.creditProposal.attributes['complienceReccomendation'].analystRecommendation === undefined) {
      this.creditProposal.attributes['complienceReccomendation'].analystRecommendation = '';
    }
  }

  public disabledOffering() {
    this.route = this.activatedRoute.snapshot.data['offeringLetter'];
    if (this.route) {
      this.view = true;
    }
    if (
      this.creditProposal.statusId === 'CP_CC_DEPT_HEAD' ||
      this.creditProposal.statusId === 'CP_CC_DIV_HEAD' ||
      this.creditProposal.statusId === 'CP_CC_DIRECTOR'
    ) {
      this.view = true;
    }
    console.log('ini route', this.route);
  }

  public disabledCompliance: boolean;
  public conditionDisableCompliance() {
    if (
      this.creditProposal.statusId === 'CP_CC_DEPT_HEAD' ||
      this.creditProposal.statusId === 'CP_CC_DIV_HEAD' ||
      this.creditProposal.statusId === 'CP_CC_DIRECTOR'
    ) {
      this.disabledCompliance = true;
    } else {
      this.disabledCompliance = false;
    }
  }
}
