import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalDialogOpinionHistoryComponent } from './dialog-opinion-history/credit-proposal-dialog-opinion-history.component';

import lodash from 'lodash';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-credit-proposal-opinion-history',
  templateUrl: './credit-proposal-opinion-history.component.html',
  styleUrls: ['./opinion-history.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalOpinionHistoryComponent implements OnInit, OnChanges {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;
  @Input() saveWordMinio;
  @Input() cp: ICreditProposal;

  public _creditProposalItem: ICreditProposal;
  public notes: any;

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
    if (this.creditProposalItem.notes.length > 0) {
      this.notes = lodash.cloneDeep(this.creditProposalItem.notes);
      for (let i = 0; i < this.notes.length; i++) {
        this.notes[i].message = this.notes[i].message ? this.notes[i].message.replace(/<(?:.|\n)*?>/gm, '') : '';
        this.notes[i].condition = this.notes[i].condition ? this.notes[i].condition.replace(/<(?:.|\n)*?>/gm, '') : '';
        this.notes[i].createDate = this.notes[i].createDate ? this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd') : '';
      }
    }
    // if (this.saveWordMinio) {
    //   this.triggeredSave();
    // }
    // this.getContainer();
  }

  public tools: ToolbarModule = {
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
      'Outdent',
      'Indent',
      'SuperScript',
      'SubScript',
      'CreateLink',
    ],
  };

  constructor(
    public accountService: AccountService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    private storageService: StorageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.creditProposalItem.currentValue.notes.length > 0) {
    //   this.notes = lodash.cloneDeep(changes.creditProposalItem.currentValue.notes);
    //   for (let i = 0; i < this.notes.length; i++) {
    //     this.notes[i].message = this.notes[i].message ? this.notes[i].message.replace(/<(?:.|\n)*?>/gm, '') : '';
    //     this.notes[i].condition = this.notes[i].condition ? this.notes[i].condition.replace(/<(?:.|\n)*?>/gm, '') : '';
    //     this.notes[i].createDate = this.notes[i].createDate ? this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd') : '';
    //   }
    // }
    if (this.saveWordMinio) {
      this.triggeredSave();
    }
    this.getContainer();
  }
  ngOnInit(): void {
    this.bucket = 'hana';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/opinion/' + this.paramsIdGet + '/sfdt';
      this.getContainer();
    });
    this.accountService.identity().subscribe(account => {
      const currentAccount = account;
      this.creditProposalItem.attributes['tempLoggedInNotes'] = '';
      this.creditProposalItem.attributes['tempLoggedInRecomendation'] = '';
      this.creditProposalItem.attributes['tempLoggedInCondition'] = '';
      if (this.creditProposalItem.notes.length > 0) {
        for (let i = 0; i < this.creditProposalItem.notes.length; i++) {
          if (this.creditProposalItem.notes[i].userId === currentAccount.login) {
            this.creditProposalItem.attributes['tempLoggedInNotes'] = this.creditProposalItem.notes[i].message;
            this.creditProposalItem.attributes['tempLoggedInRecomendation'] = this.creditProposalItem.notes[i].recomendation;
            this.creditProposalItem.attributes['tempLoggedInCondition'] = this.creditProposalItem.notes[i].condition;
          }
        }
      }
    });
    this.getContainer();
  }

  public openDialog(element: INotes = null): void {
    const predicate = {
      width: '80vw',
      data: {
        notes: element,
        creditProposalItem: this.creditProposalItem,
      },
    };

    const dialogRef = this.dialog.open(CreditProposalDialogOpinionHistoryComponent, predicate);
  }

  // Word Save
  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/opinion';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'credit-proposal-remark-' + paramsId + '-opinion-' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'credit-proposal-remark-' + paramsId + '-opinion-' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-opinion-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                // const contents: string = e.target.result;
                const contents: any = e.target.result;
                console.log('target', e.target);
                docEditor.open(contents);
                // .blocks[0].inlines[0].text
                // e.sections[0].blocks[0].inlines['text']
                console.log('ini contents', e.target.sections);
                console.log('ini container', this.container);
                console.log('tes res', res);
              };
              fileReader.readAsText(this.fileGet);
              console.log('ini file get', this.fileGet);
            });
        }
      });
  }
  myFunction(value: string) {
    console.log('cek value', value);
  }

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }
}
