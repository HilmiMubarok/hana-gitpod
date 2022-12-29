import { Component, ViewEncapsulation, Input, OnChanges, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';

import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'jhi-credit-proposal-group-guarantor-analysis',
  templateUrl: './credit-proposal-group-guarantor-analysis.component.html',
  styleUrls: ['./credit-proposal-group-guarantor-analysis.component.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalGroupGuarantorAnalysisComponent implements OnInit, OnChanges {
  private _creditProposalItem: ICreditProposal;

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;
  constructor(private router: Router, protected activatedRoute: ActivatedRoute, private storageService: StorageService) {
    this.bucket = '';
  }
  @Input() saveWordMinio: any;
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(data: ICreditProposal) {
    this._creditProposalItem = data;
  }
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  ngOnInit() {
    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/guarantor/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.saveWordMinio) {
      this.triggeredSave();
    }
  }
  // public tools: object = {
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
  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      args.isHandled = true;
      console.log('ini paste');
    }
  }

    onDocumentChange() {
    this.container.restrictEditing = true;
    // this.getWord();
    this.getContainer();
  }

  onCreate(): void {
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/guarantor';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'credit-proposal-remark-' + paramsId + '-guarantor' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'credit-proposal-remark-' + paramsId + '-guarantor' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });
  }
  private getContainer(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/guarantor/' + paramsId + '/sfdt',
    };
    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        console.log('test', obj);
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-guarantor-sfdt.sfdt');
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
  public klik() {
    this.triggeredSave();
  }
}
