import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { PositionService } from 'app/entities/position/position.service';
import { IComplienceReccomendation } from './complience.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { takeUntil, Subject } from 'rxjs';
@Component({
  selector: 'jhi-loan-analys-compliance',
  templateUrl: './loan-analys-compliance.component.html',
  styleUrls: ['./compliance-recommendation.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class LoanAnalysComplianceComponent implements OnInit, OnChanges {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;
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
  public _word: boolean;

  private tempRouter: String = '';
  public isShowOpinionFieldInput = false;

  @Input()
  get word() {
    return this._word;
  }

  set word(item: boolean) {
    this._word = item;
  }

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
    protected router: Router,
    public storageService: StorageService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.view = false;

    this.tempRouter = this.router.url.split('/')[1];
    if (this.tempRouter === 'cc-checking') {
      this.isShowOpinionFieldInput = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['word'].currentValue === true) {
      this.triggeredSave();
    }
  }

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  public onSelect(value: string, data: any): void {
    this.dataCompliance[data.No - 1].value = value;
    this.creditProposal.attributes['complienceReccomendation'].complienceRec = this.dataCompliance;
  }

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
      criteria:
        'a. Audited (asset/sales > Rp 50 bio atau merupakan perusahaan terbuka) \n' +
        'b. Inhouse Long Form (Rp 25 bio < asset/sales <Rp 50 bio) \n' +
        'c. Inhouse Short Form (asset/sales <Rp 25 bio) \n d.	Khusus debitur Yayasan Audited (asset/kekayanan di luar harta wakaf ≥Rp20 bio)',
      value: '',
      remarks: '',
    },

    {
      No: 2,
      regulation: 'Batas Maksimum Pemberian Kredit (BMPK)',
      criteria:
        'a. Pihak Terkait BMPK sebesar 10% dari Total Modal Bank Terdapat persetujuan Dewan Komisaris Bank (khusus untuk penyediaan dana kepada Pihak Terkait \n' +
        '	b.	Pihak Tidak Terkait – Indvidu BMPK sebesar 25% dari Modal Inti Bank \n' +
        '  c.	Pihak Tidak Terkait – Group BMPK sebesar 25% dari Modal Inti Bank	d.BUMN BMPK sebesar 30% dari Total Modal Bank \n' +
        'e.	Jaminan',
      value: '',
      remarks: '',
    },

    {
      No: 3,
      regulation: 'Tujuan penggunaan kredit',
      criteria:
        'a.	Bukan untuk jual beli saham kepada orang perorang atau perusahaan yang bukan perusahaan efek dan tidak melampaui persentasi jumlah pemberian kredit sebagaimana ketentuan POJK No. 40/POJK.03/2017 tentang Kredit atau Pembiayaan kepada Perusahaan Efek dan Kredit atau Pembiayaan dengan Agunan Saham. \n' +
        '	b. Bukan untuk pemberian kredit kepada Pihak Asing. \n ' +
        '  c. Bukan termasuk Kredit Negatif/Macet. \n' +
        '  d.Bukan untuk transaksi derivatif. \n' +
        '  e. Bukan untuk membiayai margin  deposit. \n' +
        '  f.	Bukan untuk pengadaan dan/atau pengolahan tanah  kepada pengembang  baik langsung maupun tidak langsung, pengecualian berlaku hanya sebagaimana ketentuan POJK No. 44/POJK.03/2017 tentang Pembatasan Pemberian Kredit atau Pembiayaan oleh Bank Umum untuk Pengadaan Tanah dan/atau Pengolahan Tanah dan perubahannya. \n' +
        '  g.	Bukan pemberian kredit untuk penyelesaian kredit bermasalah dengan cara menambahkan plafond kredit atau tunggakan-tunggakan bunga dan mengkapitalisasi tunggakan bunga (plafondering) sebagaimana dilarang dalam POJK No. 42/POJK.03/2017 tentang Kewajiban Penyusunan dan Pelaksanaan Kebijakan Perkreditan atau Pembiayaan Bank bagi Bank Umum.	h.Memiliki izin lingkungan berupa AMDAL (Analisis Mengenai Dampak Lingkungan) dan/atau UKL UPL (Upaya Pengelolaan Lingkungan Hidup dan Upaya Pemantauan Lingkungan Hidup). Penyusunan dan Pelaksanaan Kebijakan Perkreditan atau Pembiayaan Bank bagi Bank Umum. \n ' +
        '	h.	Memiliki izin lingkungan berupa AMDAL (Analisis Mengenai Dampak Lingkungan) dan/atau UKL UPL (Upaya Pengelolaan Lingkungan Hidup dan Upaya Pemantauan Lingkungan Hidup)',
      value: '',
      remarks: '',
    },
    {
      No: 4,
      regulation: 'Khusus untuk perusahaan pembiayaan',
      criteria:
        'Khusus untuk perusahaan pembiayaan	a.	Jangka waktu pengembalian pinjaman paling singkat 1 tahun.\n' +
        'b.	Dituangkan dalam bentuk perjanjian akta notaril.\n' +
        'c.	Tidak dapat diperpanjang secara otomatis (automatic roll over).\n' +
        'd.	Gearing ratio paling rendah 0 (nol) dan paling tinggi 10 (sepuluh) kali.\n' +
        'e.	Memiliki tingkat kesehatan keuangan dengan kondisi minimum sehat.\n' +
        'f.	Memiliki tingkat risiko perusahaan dengan kondisi minimum sedang rendah.',
      value: '',
      remarks: '',
    },
    {
      No: 5,
      regulation: 'Khusus untuk Bank Perkreditan Rakyat',
      criteria:
        'a. Khusus untuk Bank Perkreditan Rakyat	a.	Wajib memiliki izin OJK.\n' +
        'b. Gearing ratio paling rendah 0 (nol) dan paling tinggi 10 (sepuluh) kali.\n' +
        'c.	Memiliki tingkat kesehatan keuangan dengan kondisi minimum peringkat komposit 3(tiga).\n' +
        'd.	Gearing ratio paling sedikit 5% (lima persen).',
      value: '',
      remarks: '',
    },
    {
      No: 6,
      regulation: 'Khusus untuk Perusahaan Modal Ventura',
      criteria:
        'a.	Wajib memiliki izin OJK.\n' +
        'b.	Wajib memiliki penyertaan saham dan/atau penyertaan melalui pembelian obligasi konversi paling rendah sebesar 15% (lima belas persen) dari total kegiatan usaha.\n' +
        'c.	Memiliki tingkat kesehatan keuangan dengan kondisi minimum sehat.\n' +
        'd.  Memiliki Ekuitas paling sedikit Rp50.000.000.000,00 (lima puluh miliar rupiah).\n' +
        'e.	Gearing ratio paling rendah 0 (nol) dan paling tinggi 10 (sepuluh) kali.',
      value: '',
      remarks: '',
    },
    {
      No: 7,
      regulation: 'Khusus untuk debitur yayasan',
      criteria:
        'a.	Tujuan pendirian yayasan bukan untuk kegiatan usaha atau bisnis keluarga \n' +
        'b.	Masa jabatan pengurus/pembina tidak melebihi jangka waktu 5 tahun dan dapat diangkat kembali untuk 1 kali masa jabatan.\n' +
        'c.	Pedapatan yayasan tidak dapat dijadikan analisa kemampuan membayar debitur yang tercatat sebagai pembina/pengurus/pengawas yayasan.',
      value: '',
      remarks: '',
    },
    {
      No: 8,
      regulation: 'Khusus Perusahaan Sekuritas/LKNB',
      criteria:
        'a.	Bank dilarang memberikan kredit atau pembiayaan untuk jual beli saham kepada orang  perseorangan atau perusahaan yang bukan Perusahaan Efek.\n' +
        'b.	Bank  hanya  dapat  memberikan  kredit  atau  pembiayaankepada  suatu  Perusahaan  Efek  masing-masing  paling tinggi  sebesar  jumlah  yang  terkecil  antara  25% dari  modal  Perusahaan  Efek  yang bersangkutan  atau 15%  dari  modal Bank\n' +
        'c.	Kredit kepada seluruh Perusahaan Efek paling tinggi sebesar 30% dari modal Bank',
      value: '',
      remarks: '',
    },
    {
      No: 9,
      regulation: 'Khusus Untuk Restrukturisasi',
      criteria:
        '	a.	Debitur mengalami kesulitan pembayaran pokok dan/atau bunga Kredit\n' +
        +'b.	Debitur masih memiliki prospek usaha yang baik dan dinilai mampu memenuhi kewajiban setelah Kredit direstrukturisasi\n' +
        'c.	Restrukturisasi Kredit tidak bertujuan untuk memperbaiki kualitas Kredit\n' +
        'd.	Restrukturisasi Kredit tidak bertujuan untuk menghindari peningkatan pembentukan PPKA\n' +
        'e.	Apabila kredit yang akan direstrukturisasi merupakan Kredit kepada Pihak Terkait maka wajib dianalisis oleh konsultan keuangan independen yang memiliki izin usaha dan reputasi yang baik.\n' +
        'f. Restrukturisasi Kredit dilakukan antara lain dengan cara: Penurunan suku bunga Kredit; Perpanjangan jangka waktu Kredit; Pengurangan tunggakan pokok Kredit; Pengurangan tunggakan bunga Kredit; Penambahan fasilitas Kredit; Konversi Kredit menjadi Penyertaan Modal Sementara; dan/atau Upaya Perbaikan Lainnya\n' +
        'g.	Khusus untuk restrukturisasi Covid – 19, Bank wajib memastikan bahwa debitur mampu terus bertahan dari dampak COVID-19 dan masih memiliki potensi kemampuan pembayaran pasca pandemi.',
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

    this.getContainer();
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

  private fileGet: File;

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

  onCreate(): void {
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'

    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  private ngUnsubscribe = new Subject();

  public bucket: string;

  public getKey: string;

  private getContainer(): void {
    const obj = {
      key: 'singgle-assign/compliance-recommendation/' + this.creditProposal.id + '/' + 'sfdt',
    };
    this.storageService.getBucketName().subscribe((bukcc: any) => {
      this.storageService
        .getObjects(bukcc.body.bucket, obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => {
          if (response.body.length > 0) {
            this.storageService
              .fileBlob(response.body[response.body.length - 1]['url'])
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(res => {
                this.fileGet = new File([res.body], 'singgle-assign-' + this.creditProposal.id + '-loan-analys-compile-.sfdt');
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e: any) => {
                  const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                  const contents: string = e.target.result;
                  docEditor.open(contents);
                };
                fileReader.readAsText(this.fileGet);
              });
          }
        });
    });
  }

  public triggeredSave(): void {
    if (this.tempRouter === 'cc-checking') {
      const paramsId = this.creditProposal.id;

      const key = 'singgle-assign/compliance-recommendation';

      const timeStamp = Math.floor(Date.now() / 1000);

      const docEditor = this.container?.documentEditor as DocumentEditorComponent;

      if (docEditor !== undefined) {
        docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
          const fileType = 'word';
          const fileName = 'singgle-assign-' + paramsId + '-loan-analys-compile-' + '.docs';
          const metaData = {
            objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([exportedDocument], fileName));

          this.storageService.getBucketName().subscribe((res: any) => {
            this.storageService.uploadMeta(res.body.bucket, formData, metaData).subscribe();
          });
        });

        docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
          const fileType = 'sfdt';
          const fileName = 'singgle-assign-' + paramsId + '-loan-analys-compile-' + '.sfdt';
          const metaData = {
            objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([exportedDocument], fileName));
          this.storageService.getBucketName().subscribe((res: any) => {
            this.storageService.uploadMeta(res.body.bucket, formData, metaData).subscribe();
          });
        });
      }
    }
  }
}
