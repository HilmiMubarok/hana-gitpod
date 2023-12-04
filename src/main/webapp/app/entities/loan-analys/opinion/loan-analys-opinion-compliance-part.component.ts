import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { PositionService } from 'app/entities/position/position.service';
import { INotes } from 'app/entities/notes/notes.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { LoanAnalysDialogOpinionCompliancePartComponent } from '../dialogs/loan-analys-dialog-opinion-compliance-part.component';

import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';

import lodash from 'lodash';
import * as uuid from 'uuid';

@Component({
  selector: 'jhi-loan-analys-opinion-compliance-part',
  templateUrl: './loan-analys-opinion-compliance-part.component.html',
  styleUrls: ['./loan-analys-opinion.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class LoanAnalysOpinionCompliancePartComponent implements OnInit, OnDestroy {
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  @Output() uuidPath = new EventEmitter<string>();
  @Output() typeOpinion = new EventEmitter<string>();
  @Output() positionLoginEmitCompliance = new EventEmitter<number>();

  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  public notes: INotes[];

  public _creditProposalItem: ICreditProposal;
  public route: any;
  public parentPath = this.router.url.split('/')[1];

  public customHeadersJWT: any;

  private fileGet: File;
  public currentAccount: any;

  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  private positionLogin: any;

  private positionLoanComitee: string;

  public isShowOpinionFieldInput = false;

  private uuid: any;
  public positionLocStor: number;

  constructor(
    protected datePipe: DatePipe,
    protected dialog: MatDialog,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected storageService: StorageService,
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService
  ) {
    const tempRouter = this.router.url.split('/')[1];
    if (tempRouter === 'cc-review') {
      this.isShowOpinionFieldInput = true;
    }
    this.uuid = uuid.v4();
  }

  private getLocStor(cookieName: string) {
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

  private getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
    });
  }

  public filterPositionLogin() {
    // this.positionService.findByLogin().subscribe(posisi => {
    // let tempLoginId = 0;

    //   // for (let i = 0; i < this.positionLogin.length; i++) {
    //   //   tempLoginId = this.positionLogin[i].id;
    //   // }

    //   this.positionLoginEmitCompliance.emit(tempLoginId);
    //   this.refresh();
    // });
    this.positionLoginEmitCompliance.emit(this.positionLocStor);
    this.refresh();
  }

  ngOnInit(): void {
    this.positionLocStor = this.getLocStor('POS');
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.typeOpinion.emit('compliance');
    this.uuidPath.emit(this.uuid);

    this.getWord();
    this.filterPositionLogin();
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

  public openDialog(element: INotes = null): void {
    const predicate = {
      width: '80vw',
      data: { item: this.creditProposalItem },
    };

    predicate.data['notes'] = element;

    const dialogRef = this.dialog.open(LoanAnalysDialogOpinionCompliancePartComponent, predicate);
  }

  public onDocumentChange() {
    this.container.restrictEditing = true;
  }

  public triggeredSave(): void {
    let paramsId = '';

    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    const key = 'credit_proposal/remark/opinion-history/compliance/opinion';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const pathHelper = this.uuid + '-opinion';
      const fileName = this.uuid + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${pathHelper}/${fileType.replace('&', '')}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));
      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const pathHelper = this.uuid + '-opinion';
      const fileName = this.uuid + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${pathHelper}/${fileType.replace('&', '')}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });
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

  public onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
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

  public refresh() {
    this.creditProposalService.find(this.creditProposalItem.id).subscribe(res => {
      this.notes = res.body.notes;

      if (this.notes) {
        if (this.notes.length > 0) {
          this.notes.sort((a, b) => (a.id > b.id ? 1 : -1));
        }
      }

      if (this.notes) {
        if (this.notes.length > 0) {
          this.notes = this.notes.filter(note => note.type === 'compliance');
        }
      }
    });
  }

  ngOnDestroy() {
    this.typeOpinion.emit('');
  }
}
