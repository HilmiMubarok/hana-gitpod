import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
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
import { CreditProposalService } from '../credit-proposal.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { PositionService } from 'app/entities/position/position.service';
@Component({
  selector: 'jhi-credit-proposal-opinion-history',
  templateUrl: './credit-proposal-opinion-history.component.html',
  styleUrls: ['./opinion-history.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalOpinionHistoryComponent implements OnInit {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor_container_condition')
  public container_condition: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public _creditProposalItem: ICreditProposal;
  public notes: any;

  private BUCKET: string;

  private ngUnsubscribe = new Subject();
  private paramId: string;
  private getKey: string;
  private fileGet: File;
  private userId: any;
  public positionId: any;
  public resourceUrl: string;
  public positionLogin: any;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
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
    private storageService: StorageService,
    private creditProposalService: CreditProposalService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private positionService: PositionService
  ) {}

  public currentAccount: any;

  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');

    this.getLogin();
    this.filterPositionLogin();
    this.getWord();
    this.refresh();
  }

  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
      this.getContainerCondition();
    });
  }

  public getLogin() {
    this.accountService.identity().subscribe(account => {
      this.userId = account.login;
    });
  }

  @Output() newItemEvent = new EventEmitter<string>();

  change(event: string){
    this.newItemEvent.emit(event);
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
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionId = posisi.body[0].name;
      let paramsId = '';
      this.activatedRoute.params.subscribe(params => {
        paramsId = params['id'];
      });
      const key = 'credit_proposal/remark/opinion-history/opinion';

      const timeStamp = Math.floor(Date.now() / 1000);

      const docEditor = this.container?.documentEditor as DocumentEditorComponent;

      docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const fileType = 'word';
        const fileName =
          'credit-proposal-remark-' + paramsId.replace('&', '') + '-' + this.positionId.replace('&', '') + '-' + this.userId.replace('&', '') + '-opinion-' + fileType.replace('&', '') + '.docs';
        const metaData = {
          objectName: `${key}/${paramsId}/${this.positionId.replace('&', '')}-${this.userId.replace('&', '')}/${fileType.replace('&', '')}/${fileName.replace('&', '')}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileType = 'sfdt';
        const fileName =
          'credit-proposal-remark-' + paramsId + '-' + this.positionId.replace('&', '') + '-' + this.userId.replace('&', '') + '-opinion-' + fileType.replace('&', '') + '.sfdt';
        const metaData = {
          objectName: `${key}/${paramsId}/${this.positionId.replace('&', '')}-${this.userId.replace('&', '')}/${fileType.replace('&', '')}/${fileName.replace('&', '')}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
      });
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
    }
  }

  public obj: any;

  private getContainer(): void {
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionId = posisi.body[0].name;
      let paramsId = '';
      this.activatedRoute.params.subscribe(params => {
        paramsId = params['id'];
      });
      this.obj = {
        key: 'credit_proposal/remark/opinion-history/opinion/' + paramsId.replace('&', '') + '/' + this.positionId.replace('&', '') + '-' + this.userId.replace('&', '') + '/sfdt',
      };
      this.storageService
        .getObjects(this.BUCKET, this.obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => {
          if (response.body.length > 0) {
            this.storageService
              .fileBlob(response.body[response.body.length - 1]['url'])
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(res => {
                this.fileGet = new File(
                  [res.body],
                  'credit-proposal-remark-' + paramsId + '-' + this.positionId.replace('&', '') + '-' + this.userId.replace('&', '') + '-opinion-sfdt.sfdt'
                );
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e: any) => {
                  const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                  const contents: any = e.target.result;
                  docEditor.open(contents);
                };
                fileReader.readAsText(this.fileGet);
              });
          }
        });
      this.refresh();
    });
  }

  onCreate(): void {
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  // Condition On Opinion
  public triggeredSaveCondition(): void {
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionId = posisi.body[0].name;
      let paramsId = '';
      this.activatedRoute.params.subscribe(params => {
        paramsId = params['id'];
      });
      const key = 'credit_proposal/remark/opinion-history/condition';

      const timeStamp = Math.floor(Date.now() / 1000);

      const docEditor = this.container_condition?.documentEditor as DocumentEditorComponent;
   

      docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const fileType = 'word';
        const fileName =
          'credit-proposal-remark-' +
          paramsId.replace('&', '') +
          '-' +
          this.positionId.replace('&', '') +
          '-' +
          this.userId.replace('&', '') +
          '-opinion' +
          '-condition-' +
          fileType.replace('&', '') +
          '.docs';
        const metaData = {
          objectName: `${key}/${paramsId}/${this.positionId.replace('&', '')}-${this.userId.replace('&', '')}/${fileType.replace('&', '')}/${fileName.replace('&', '')}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileType = 'sfdt';
        const fileName =
          'credit-proposal-remark-' +
          paramsId.replace('&', '') +
          '-' +
          this.positionId.replace('&', '') +
          '-' +
          this.userId.replace('&', '') +
          '-opinion-' +
          '-condition-' +
          fileType.replace('&', '') +
          '.sfdt';
        const metaData = {
          objectName: `${key}/${paramsId}/${this.positionId.replace('&', '')}-${this.userId.replace('&', '')}/${fileType}/${fileName.replace('&', '')}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
      });
    });
  }

  public onKeyDownCondition(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  private getContainerCondition(): void {
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionId = posisi.body[0].name;
      let paramsId = '';
      this.activatedRoute.params.subscribe(params => {
        paramsId = params['id'];
      });
      const obj = {
        key: 'credit_proposal/remark/opinion-history/condition/' + paramsId + '/' + this.positionId.replace('&', '') + '-' + this.userId.replace('&', '') + '/sfdt',
      };
      this.storageService
        .getObjects(this.BUCKET, obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => {
          if (response.body.length > 0) {
            this.storageService
              .fileBlob(response.body[response.body.length - 1]['url'])
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(res => {
                this.fileGet = new File(
                  [res.body],
                  'credit-proposal-remark-' +
                    paramsId +
                    '-' +
                    this.positionId +
                    '-' +
                    this.userId +
                    '-opinion-' +
                    'condition-sfdt.sfdt'
                );
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e: any) => {
                  const docEditor = this.container_condition?.documentEditor as DocumentEditorComponent;
                  const contents: string = e.target.result;
                  docEditor.open(contents);
                };
                fileReader.readAsText(this.fileGet);
              });
          }
        });
    });
  }

  onCreateCondition(): void {
    this.container_condition.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  public filterPositionLogin() {
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionLogin = posisi.body;
      this.positionId = posisi.body[0].name;
      for (let i = 0; i < this.positionLogin.length; i++) {
        this.creditProposalItem.attributes['positionLogin'] = this.positionLogin[i].positionTypeDescription;
      }
    });
  }

  public recomendasi: string

  public refresh() {
    this.accountService.identity().subscribe(account => {
      this.creditProposalItem.attributes['tempLoggedInNotes'] = '';
      this.creditProposalItem.attributes['tempLoggedInRecomendation'] = '';
      this.creditProposalItem.attributes['tempLoggedInCondition'] = '';

      this.creditProposalService.find(this.creditProposalItem.id).subscribe(res => {
        this.notes = res.body.notes;

        if (this.notes.length > 0) {
          for (let i = 0; i < this.notes.length; i++) {
            this.notes[i].createDate = this.notes[i].createDate ? this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd') : '';
            if (this.notes[i].userId === account.login) {
              this.creditProposalItem.notes[i].message = this.obj;
              this.creditProposalItem.attributes['tempLoggedInNotes'] = this.notes[i].message;
              this.recomendasi = this.notes[i].recomendation;
              this.creditProposalItem.attributes['tempLoggedInRecomendation'] = this.notes[i].recomendation;
              this.creditProposalItem.attributes['positionLogin'] = this.notes[i].positionUserId;
              this.creditProposalItem.attributes['tempLoggedInCondition'] = this.notes[i].condition;
            }
          }
        }
      });
    });
  }
}
