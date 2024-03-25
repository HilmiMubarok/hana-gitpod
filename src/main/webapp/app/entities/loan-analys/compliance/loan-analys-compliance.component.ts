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
import { MasterComplianceChecklistService } from 'app/entities/master-parameter/compliance-checklist/master-compliance-checklist.service';
import { ComplianceChecklistCriteriaService } from 'app/entities/master-parameter/compliance-checklist/compliance-checklist-criteria/compliance-checklist-criteria.service';
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
  public value: string;
  public remarks?: any = [];
  public attributes: any;
  public _creditProposal: ICreditProposal;
  public data: Object[];
  private id: number;
  public analystRecommendation: string;
  public route: any;
  public view: boolean;
  public _word: boolean;

  public customHeadersJWT: any;

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
    public storageService: StorageService,
    protected masterComplianceChecklistService: MasterComplianceChecklistService,
    protected complianceChecklistCriteriaService: ComplianceChecklistCriteriaService
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
    if (this.tempRouter === 'finalize-pk') {
      this.disabledCompliance = true;
    }
    if (this.tempRouter === 'review-pk') {
      this.disabledCompliance = true;
    }
    if (this.tempRouter === 'dar-revision') {
      this.disabledCompliance = true;
    }
    if (this.tempRouter === 'finalize-dpdl') {
      this.disabledCompliance = true;
    }
    if (this.tempRouter === 'dar-revision-checker') {
      this.disabledCompliance = true;
    }
    if (this.tempRouter === 'review-dpdl') {
      this.disabledCompliance = true;
    }
    if (this.tempRouter === 'finalize-dppk') {
      this.disabledCompliance = true;
    }
    if (this.tempRouter === 'review-dppk') {
      this.disabledCompliance = true;
    }
    if (this.tempRouter === 'loan-ops-distribution') {
      this.disabledCompliance = true;
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

  public dataCompliance = [];

  public getCriteriaCompliance(): void {
    this.complianceChecklistCriteriaService
      .filterTableData({
        isActive: true,
        page: 0,
        size: 9999,
        sort: ['itemNo', 'asc'], // Sort berdasarkan itemNo
      })
      .subscribe(res => {
        if (res.body.length > 0) {
          const sortedData = res.body.sort((a, b) => {
            if (a.regulationName < b.regulationName) {
              return -1;
            } else if (a.regulationName > b.regulationName) {
              return 1;
            } else {
              return 0;
            }
          }); // Mengurutkan data berdasarkan regulationName
          const data = [];
          let prevRegulation = '';
          let rowSpanCount = 0;
          for (let i = 0; i < sortedData.length; i++) {
            const currentRegulation = sortedData[i].regulationName;
            if (prevRegulation === currentRegulation) {
              rowSpanCount++;
            } else {
              rowSpanCount = 1;
              prevRegulation = currentRegulation;
            }
            const num = i + 1;
            data.push({
              No: num,
              regulation: prevRegulation,
              criteria: sortedData[i].criteria,
              value: '',
              remarks: '',
              rowSpan: rowSpanCount === 1 ? rowSpanCount : -1, // Mengatur rowSpan hanya pada baris pertama regulasi
            });
          }
          this.dataCompliance = data;
          if (this.creditProposal.attributes['complienceReccomendation'].complienceRec.length === 0) {
            this.creditProposal.attributes['complienceReccomendation'].complienceRec = this.dataCompliance;
          } else {
            for (let i = 0; i < this.creditProposal.attributes['complienceReccomendation'].complienceRec.length; i++) {
              this.dataCompliance = this.creditProposal.attributes['complienceReccomendation'].complienceRec;
              // this.remarks[i] = this.item.attributes['cpRacBelow'].cpValueBot[i].remarks;
              this.remarks[i] = this.creditProposal.attributes['complienceReccomendation'].complienceRec[i].remarks;
            }
          }
        }
      });
  }

  ngOnInit(): void {
    this.getCriteriaCompliance();

    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    // if (this.creditProposal.attributes['complienceReccomendation'].complienceRec.length !== 0) {
    //   for (let i = 0; i < this.creditProposal.attributes['complienceReccomendation'].complienceRec.length; i++) {
    //     this.dataCompliance = this.creditProposal.attributes['complienceReccomendation'].complienceRec;
    //     this.remarks[i] = this.creditProposal.attributes['complienceReccomendation'].complienceRec[i].remarks;
    //   }
    // }

    this.remaksCondition();
    this.conditionDisableCompliance();

    this.getContainer();
  }

  private getToken(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

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

  public disabledCompliance: boolean;

  public conditionDisableCompliance() {
    if (
      this.creditProposal.statusId === 'CP_CC_DEPT_HEAD' ||
      this.creditProposal.statusId === 'CP_CC_DIV_HEAD' ||
      this.creditProposal.statusId === 'CP_CC_DIRECTOR'
    ) {
      this.disabledCompliance = true;
    }
    //  Disabled Offering Letter All State
    if (
      this.tempRouter === 'distribution' ||
      this.tempRouter === 'finalize' ||
      this.tempRouter === 'review' ||
      this.tempRouter === 'confirmation' ||
      this.tempRouter === 'cc-inquiry'
    ) {
      this.disabledCompliance = true;
      console.log('c', this.tempRouter);
    }
  }

  onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
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
