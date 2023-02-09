import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subject, firstValueFrom } from 'rxjs';

import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { PositionService } from 'app/entities/position/position.service';
import { INotes } from 'app/entities/notes/notes.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { LoanAnalysDialogOpinionComponent } from '../dialogs/loan-analys-dialog-opinion.component';

import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';

import { MessageService } from 'primeng/api';
import { IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';
import { IOptionNode, OptionNode } from 'app/shared/model/option-node.model';

import lodash from 'lodash';
import * as uuid from 'uuid';

@Component({
  selector: 'jhi-loan-analys-opinion',
  templateUrl: './loan-analys-opinion.component.html',
  styleUrls: ['./loan-analys-opinion.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class LoanAnalysOpinionComponent implements OnInit, OnDestroy {
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;

    if (this._creditProposalItem.statusId === 'CP_LOAN_APPROVAL' || this._creditProposalItem.statusId === 'LA_DAR_NOTIF') {
      this.nameLabel = 'Approved Status';
    } else if (this.creditProposalItem.statusId !== 'CP_LOAN_COMMITTEE') {
      this.nameLabel = 'Recomendation';
    }

    if (this._creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
      this.approvalUser = false;
    } else {
      this.approvalUser = true;
    }
  }

  @Input() source = '';

  @Output() uuidPath = new EventEmitter<string>();
  @Output() newItemEvent = new EventEmitter<string>();
  @Output() positionLoginEmit = new EventEmitter<number>();

  @Output() opinionFileSfdt = new EventEmitter<File>();
  @Output() opinionFileWord = new EventEmitter<File>();

  @Output() conditionFileSfdt = new EventEmitter<File>();
  @Output() conditionFileWord = new EventEmitter<File>();

  @Output() isAllowSave = new EventEmitter<boolean>();

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor_container_condition')
  public container_condition: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public notes: INotes[];
  public recomendasi: string;

  private _creditProposalItem: ICreditProposal;
  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  private positionLogin: any;
  private uuid: any;

  public nameLabel: any;
  private currentAccount: any;

  private accountLogin: any;
  private userId: string;
  private positionUserId: number;
  private positionUserDescription: string;

  private nameLoanComitee: string;
  public isShowOpinionFieldInput = false;

  public approvalUser: boolean;
  public approvalUserData: any[];
  private items: any;
  private whoAmI: IPerson;
  private relType: IOptionNode[];
  private partyIdPos = '';

  private cacheData: any;

  private tempRouter: string;

  private countValidate = 0;

  constructor(
    protected datePipe: DatePipe,
    protected dialog: MatDialog,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected storageService: StorageService,
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    protected messageService: MessageService,
    protected applicationRoleService: ApplicationRoleService,
    protected personService: PersonService
  ) {
    this.tempRouter = this.router.url.split('/')[1];
    if (
      this.tempRouter === 'la-analyst' ||
      this.tempRouter === 'la-SME-CRC' ||
      this.tempRouter === 'la-approval' ||
      this.tempRouter === 'loan-committee-approval'
    ) {
      this.isShowOpinionFieldInput = true;
    }
    this.uuid = uuid.v4();

    this.approvalUserData = [];
    this.relType = [];
    this.userId = '';
    this.positionUserId = 0;
    this.positionUserDescription = '';
    this.cacheData = {
      userId: '',
      positionUserId: 0,
      positionUserDescription: '',
    };
  }

  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
    });
  }

  public filterPositionLogin() {
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionLogin = posisi.body;
      for (let i = 0; i < this.positionLogin.length; i++) {
        this.positionUserId = this.positionLogin[i].id;
        this.positionUserDescription = this.positionLogin[i].positionTypeDescription;
      }
      this.cacheData = {
        userId: this.userId,
        positionUserId: this.positionUserId,
        positionUserDescription: this.positionUserDescription,
      };
      this.positionLoginEmit.emit(this.positionUserId);
      this.refresh();
    });
  }

  public getLogin() {
    this.accountService.identity().subscribe(account => {
      this.userId = account.firstName + ' ' + account.lastName;
      this.cacheData = {
        userId: this.userId,
        positionUserId: this.positionUserId,
        positionUserDescription: this.positionUserDescription,
      };
      this.filterPositionLogin();
    });
  }

  private async getWhoAmI(): Promise<void> {
    const account: Account = await firstValueFrom(this.accountService.identity());
    const persons: IPerson[] = (await firstValueFrom(this.personService.queryFilterBy({ page: 0, size: 99, userLogin: account.login })))
      .body;
    if (persons.length > 0) {
      this.whoAmI = persons[0];
    }
  }

  private filteringRelationTypes(params: IApplicationRole[]): IOptionNode[] {
    const result: IOptionNode[] = [];
    if (params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        const each: IApplicationRole = params[i];
        if (
          each.relationTypeId &&
          lodash.find(result, function (o) {
            return o.id === each.relationTypeId;
          }) === undefined
        ) {
          if (each.relationTypeId !== 'CREDIT_PROPOSAL') {
            const newOptionNode: IOptionNode = new OptionNode();
            newOptionNode.id = each.relationTypeId;
            newOptionNode.label = each.relationTypeDescription;

            result.push(newOptionNode);
          }
        }
      }
    }
    return result;
  }

  private filteringRelType(params: IApplicationRole[]): void {
    this.relType = this.filteringRelationTypes(params);
  }

  private loadApprovalUser(): void {
    this.applicationRoleService
      .queryFilterBy({
        idApplication: this.creditProposalItem.id,
        isActive: true,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.items = res.body;
        this.filteringRelType(this.items);
        for (let i = 0; i < this.items.length; i++) {
          const each: IApplicationRole = this.items[i];
          if (each.relationTypeId && each.relationTypeId.toLowerCase() === this.relType[0].id.toLowerCase()) {
            this.approvalUserData.push(each);
          }
        }
      });
  }

  ngOnInit(): void {
    this.uuidPath.emit(this.uuid);

    this.getWord();
    this.getLogin();

    this.getWhoAmI().then(res => {
      this.loadApprovalUser();
    });
  }

  public change(event: string) {
    this.newItemEvent.emit(event);
    this.recomendasi = event;
  }

  public openDialog(element: INotes = null): void {
    const predicate = {
      width: '80vw',
      data: { item: this.creditProposalItem },
    };

    predicate.data['notes'] = element;

    const dialogRef = this.dialog.open(LoanAnalysDialogOpinionComponent, predicate);
  }

  public setApproval(event: any) {
    this.uuid = uuid.v4();
    this.uuidPath.emit(this.uuid);

    for (let i = 0; i < this.approvalUserData.length; i++) {
      if (event.value === this.approvalUserData[i].partyId) {
        this.userId = this.approvalUserData[i].partyName;
        this.nameLoanComitee = this.userId;
        this.partyIdPos = this.approvalUserData[i].partyId;
      }
    }

    this.positionService.queryFilterBy({ idParty: this.partyIdPos, size: 1, page: 0 }).subscribe(res => {
      if (res.body.length > 0) {
        this.cacheData = {
          userId: this.userId,
          positionUserId: this.positionUserId,
          positionUserDescription: this.positionUserDescription,
        };
        this.positionLoginEmit.emit(res.body[0].id);
      }
    });
  }

  public onDocumentChange() {
    this.container.restrictEditing = true;
  }

  public onDocumentChanges() {
    this.container_condition.restrictEditing = true;
  }

  private saveValidate(): void {
    this.saveFile();
    this.saveFileCon();
  }

  private async checkSfdtFile(part: string): Promise<void> {
    if (part === 'opinion') {
      const docEditor = this.container?.documentEditor as DocumentEditorComponent;

      await docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileName = this.uuid + '.sfdt';
        const testFile = new File([exportedDocument], fileName);
        if (testFile) {
          const fileReader: FileReader = new FileReader();
          fileReader.onload = (e: any) => {
            const testSfdtFile = JSON.parse(fileReader.result as string);
            if (testSfdtFile.sections[0].blocks[0].inlines.length > 0) {
              ++this.countValidate;
            }
          };
          fileReader.readAsText(testFile);
        }
      });
    } else if (part === 'condition') {
      const docEditor = this.container_condition?.documentEditor as DocumentEditorComponent;

      await docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileName = this.uuid + '.sfdt';
        const testFile = new File([exportedDocument], fileName);
        if (testFile) {
          const fileReader: FileReader = new FileReader();
          fileReader.onload = (e: any) => {
            const testSfdtFile = JSON.parse(fileReader.result as string);
            if (testSfdtFile.sections[0].blocks[0].inlines.length > 0) {
              ++this.countValidate;
            }
            if (this.countValidate === 3) {
              this.isAllowSave.emit(true);
              this.saveValidate();
            } else {
              this.isAllowSave.emit(false);
            }
          };
          fileReader.readAsText(testFile);
        }
      });
    }
  }

  private validate(): void {
    this.countValidate = 0;

    if (this.recomendasi) {
      ++this.countValidate;
    }

    this.checkSfdtFile('opinion').then(() => {
      this.checkSfdtFile('condition').then();
    });
  }

  public triggeredSaveValidate(): void {
    if (this.source === '') {
      if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
        if (this.nameLoanComitee) {
          this.validate();
        } else {
          this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Please check Approval User Selection' });
        }
      } else {
        this.validate();
      }
    }
  }

  private saveFile(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    const key = 'credit_proposal/remark/opinion-history/opinion';

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

  public triggeredSave(): void {
    if (this.source === '') {
      if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
        if (this.nameLoanComitee || this.recomendasi !== '') {
          this.saveFile();
        } else {
          this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Please check Approval User / Recomendation' });
        }
      } else {
        this.saveFile();
      }
    }
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
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  private saveFileCon(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    const key = 'credit_proposal/remark/opinion-history/condition';

    const docEditor = this.container_condition?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const pathHelper = this.uuid + '-condition';
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
      const pathHelper = this.uuid + '-condition';
      const fileName = this.uuid + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${pathHelper}/${fileType.replace('&', '')}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });
  }

  public triggeredSaveCondition(): void {
    if (this.source === '') {
      if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
        if (this.nameLoanComitee || this.recomendasi !== '') {
          this.saveFileCon();
        } else {
          this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Please check Approval User / Recomendation' });
        }
      } else {
        this.saveFileCon();
      }
    }
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

  public onCreateCondition(): void {
    this.container_condition.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  public refresh() {
    this.creditProposalService.find(this.creditProposalItem.id).subscribe(res => {
      this.notes = res.body.notes;

      if (this.notes) {
        if (this.notes.length > 0) {
          this.notes.sort((a, b) => (a.id > b.id ? 1 : -1));
        }
      }

      if (
        this.tempRouter === 'loan-committee-approval' ||
        this.tempRouter === 'dar-final' ||
        this.tempRouter === 'dar-checker' ||
        this.tempRouter === 'dar-notif' ||
        this.tempRouter === 'cc-checking' ||
        this.tempRouter === 'cc-review' ||
        this.tempRouter === 'cc-inquiry' ||
        this.tempRouter === 'finalize' ||
        this.tempRouter === 'review' ||
        this.tempRouter === 'confirmation'
      ) {
        if (this.notes) {
          if (this.notes.length > 0) {
            this.notes = this.notes.filter(
              note => note.type === 'credit_proposal' || note.type === 'loan_analysis' || note.type === 'loan_committee'
            );
          }
        }
      } else if (
        this.tempRouter === 'la-analyst' ||
        this.tempRouter === 'la-SME-CRC' ||
        this.tempRouter === 'la-approval' ||
        this.tempRouter === 'la-approval-inquiry'
      ) {
        if (this.notes) {
          if (this.notes.length > 0) {
            this.notes = this.notes.filter(note => note.type === 'credit_proposal' || note.type === 'loan_analysis');
          }
        }
      }

      if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
        if (this.notes.length > 0) {
          for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].positionId === this.cacheData.positionUserId) {
              this.newItemEvent.emit(this.notes[i].recomendation);
            }
          }
        }
      } else {
        this.accountService.identity().subscribe(account => {
          this.currentAccount = account;
          if (this.notes.length > 0) {
            for (let i = 0; i < this.notes.length; i++) {
              if (
                this.notes[i].employeeFirstName + ' ' + this.notes[i].employeeLastName ===
                this.currentAccount.firstName + ' ' + this.currentAccount.lastName
              ) {
                this.newItemEvent.emit(this.notes[i].recomendation);
              }
            }
          }
        });
      }
    });
  }

  ngOnDestroy() {
    const docEditorOpinion = this.container?.documentEditor as DocumentEditorComponent;
    const docEditorCondition = this.container_condition?.documentEditor as DocumentEditorComponent;

    const fileNameSfdt = this.uuid + '.sfdt';
    const fileNameWord = this.uuid + '.word';

    docEditorOpinion.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const testFile = new File([exportedDocument], fileNameSfdt);
      if (testFile) {
        this.opinionFileSfdt.emit(testFile);
      }
    });

    docEditorOpinion.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const testFile = new File([exportedDocument], fileNameWord);
      if (testFile) {
        this.opinionFileWord.emit(testFile);
      }
    });

    docEditorCondition.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const testFile = new File([exportedDocument], fileNameSfdt);
      if (testFile) {
        this.conditionFileSfdt.emit(testFile);
      }
    });

    docEditorCondition.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const testFile = new File([exportedDocument], fileNameWord);
      if (testFile) {
        this.conditionFileWord.emit(testFile);
      }
    });
  }
}
