import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
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
  selector: 'jhi-credit-proposal-trade-checking-remarks',
  templateUrl: './credit-proposal-trade-checking-remarks.component.html',
  styleUrls: ['../trade-checking.scss'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class RemarskComponent implements OnInit, OnChanges {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private _creditProposal: ICreditProposal;

  @Input() saveWord: any;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor(
    protected creditProposalService: CreditProposalService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) {}

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-trade-checking-sfdt.sfdt');
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

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
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
      // console.log('ini paste');
    }
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/trade-checking';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'credit-proposal-remark-' + paramsId + '-trade-checking-' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'credit-proposal-remark-' + paramsId + '-trade-checking-' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });
  }

  ngOnInit() {
    this.bucket = 'hana';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/trade-checking/' + this.paramsIdGet + '/sfdt';
      this.getContainer();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.saveWord === true) {
      this.triggeredSave();
    }
  }
  // public ststusId:Boolean
  // public x(){
  //   if(this.creditProposal.statusId==='DRAFT'){
  //     this.ststusId = true
  //   }
  // }

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
}
