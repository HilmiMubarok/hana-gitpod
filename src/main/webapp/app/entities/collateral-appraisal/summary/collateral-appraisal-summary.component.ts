import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { ICollateralAppraisal } from '../collateral-appraisal.model';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { takeUntil, Subject } from 'rxjs';
import { STATUS } from 'app/shared/constants/status.constants';
@Component({
  selector: 'jhi-collateral-appraisal-summary',
  templateUrl: './collateral-appraisal-summary.component.html',
  styleUrls: ['./collateral-appraisal-summary.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CollateralAppraisalSummaryComponent implements OnInit, OnChanges {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  @Input() collateralAppraisal: ICollateralAppraisal;
  @Input() input: any;
  private _item: ICreditProposal;
  public formatType?: string;

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  constructor(
    protected reportUtils: ReportUtilService,
    private storageService: StorageService,
    protected activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.bucket = '';
  }

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  private getContainer(): void {
    const obj = {
      key: this.getKey,
    };
    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'apprasials-remark-' + this.paramsIdGet + '-keterangan-objek-jaminan-sfdt.sfdt');
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
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
      console.log('ini paste');
    }
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'appraisals/remark/keterangan-objek-jaminan';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'apprasials-remark-' + paramsId + '-keterangan-objek-jaminan-' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'apprasials-remark-' + paramsId + '-keterangan-objek-jaminan-' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  ngOnInit(): void {
    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'appraisals/remark/keterangan-objek-jaminan/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.input === true) {
      this.triggeredSave();
    }
  }

  // public tools: ToolbarModule = {
  //   items: [
  //     'FontName',
  //     'FontSize',
  //     'Bold',
  //     'Italic',
  //     'Underline',
  //     'StrikeThrough',
  //     'FontColor',
  //     'BackgroundColor',
  //     'OrderedList',
  //     'UnorderedList',
  //     'Outdent',
  //     'Indent',
  //     'SuperScript',
  //     'SubScript',
  //     'CreateLink',
  //   ],
  // };

  public listOfValue = { formatType: ['Word', 'Pdf'] };

  public generate(type?: string): void {
    this.print(type);
  }

  print(type?: string) {
    const id = this.item.id;
    if (this.formatType === 'Word') {
      this.reportUtils.downloadFile2('/services/report/api/report/survey-appraisal/word-stream/' + id, '', 'Report_' + id);
    } else if (this.formatType === 'Pdf') {
      this.reportUtils.viewFile('/services/report/api/report/survey-appraisal/pdf-word-stream/' + id);
    }
  }

  gakbisa() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
  onDocumentChange() {
    this.container.restrictEditing = true;

    this.getContainer();
  }
}
