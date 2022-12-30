import { Component, Input, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from '../../credit-proposal.model';

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
  selector: 'jhi-credit-proposal-collateral-info-remarks-checklist',
  templateUrl: './credit-proposal-collateral-info-remarks-checklist.component.html',
  styleUrls: ['../checklist/credit-proposal-collateral-info-checklist.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalCollateralInfoRemarksChecklistComponent implements OnInit, OnChanges {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public _creditProposal: ICreditProposal;
  public remarks: string;
  public newMessage: string;
  public pacth: any;
  public view: boolean;

  public menuName: any;

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  constructor(protected activatedRoute: ActivatedRoute, private router: Router, private storageService: StorageService) {
    this.bucket = '';
  }
  @Input() saveWord: any;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  //   @Input()
  //   get menu() {
  //     return this.menuName;
  //   }

  //   set menu(menuName: string) {
  //     this.menuName = menuName;

  //   }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  ngOnInit(): void {
    this.removeTagRemaks();
    this.pathremove();

    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];

      this.getKey = 'credit_proposal/remark/collateral-info/checklist/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });
  }
  onDocumentChange() {
    this.container.restrictEditing = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.saveWord === true) {
      //   this.triggeredSave();
    }
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

  public pathremove() {
    this.pacth = this.router.url.split('/')[1];
    if (this.pacth === 'la-approval' || this.pacth === 'cp-status-approval') {
      this.view = true;
    }

    console.log('test', this.pacth);
  }

  removeTagRemaks() {
    this.newMessage = this.creditProposal.attributes['collateralChecklist'].remarks;
    this.newMessage = this.newMessage.replace(/<(.|\n)*?>/g, '');
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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-collateral-info-sfdt.sfdt');
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
      console.log('ini paste');
    }
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    let key: string;
    this.getBucket().then(res => {
      key = 'credit_proposal/remark/collateral-info/checklist/';

      const timeStamp = Math.floor(Date.now() / 1000);

      const docEditor = this.container?.documentEditor as DocumentEditorComponent;

      docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const fileType = 'word';
        const fileName = 'credit-proposal-remark-' + paramsId + '-collateral-info-' + fileType + '.docs';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileType = 'sfdt';
        const fileName = 'credit-proposal-remark-' + paramsId + '-collateral-info-' + fileType + '.sfdt';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });
    });
  }
}
