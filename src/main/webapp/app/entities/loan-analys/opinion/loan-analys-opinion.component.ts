import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import lodash from 'lodash';
import { LoanAnalysDialogOpinionComponent } from '../dialogs/loan-analys-dialog-opinion.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from 'app/entities/storage/storage.service';

@Component({
  selector: 'jhi-loan-analys-opinion',
  templateUrl: './loan-analys-opinion.component.html',
  styleUrls: ['./loan-analys-opinion.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class LoanAnalysOpinionComponent implements OnInit, OnChanges {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public _creditProposalItem: ICreditProposal;
  public notes: any;
  public route: any;
  public view: boolean;
  public pacth: any;

  // public parentPath = this.router.url.split('/')[1];
  public nameLabel: any;
  public radioButtonPurpose: any;
  public radioButtonCondition: any;
  public radioButtonNotRecommend: any;
  public valueRadioPurpose: any;
  public valueRadioCondition: any;
  public valueRadioRecommend: any;
  @Input() cp: ICreditProposal;
  public listOfValue = {
    listApproval: ['Head credit review 1', 'Head credit review 2', 'Business director', 'Credit director', 'Finance director'],
  };
  @Input() saveWordMinio;
  @Input() saveWordCondition;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cp.currentValue.notes.length > 0) {
      this.notes = lodash.cloneDeep(changes.cp.currentValue.notes);
      for (let i = 0; i < this.notes.length; i++) {
        this.notes[i].message = this.notes[i].message ? this.notes[i].message.replace(/<(?:.|\n)*?>/gm, '') : '';
        this.notes[i].condition = this.notes[i].condition ? this.notes[i].condition.replace(/<(?:.|\n)*?>/gm, '') : '';
        this.notes[i].createDate = this.notes[i].createDate ? this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd') : '';
      }
    }
    if (this.saveWordMinio) {
      this.triggeredSave();
    }
    if (this.saveWordCondition) {
      this.triggeredSaveCondition();
    }
  }

  constructor(
    public accountService: AccountService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    private storageService: StorageService
  ) {
    this.view = false;
  }
  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  ngOnInit(): void {
    this.bucket = 'hana';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/opinion/' + this.paramsIdGet + '/sfdt';
      this.getContainer();
    });
    this.bucket = 'hana';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/opinion/condition/' + this.paramsIdGet + '/sfdt';
      this.getContainerCondition();
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
    this.readOnlyOffering();
    this.conditionOpinion();
    this.removefield();
    this.getContainer();
    this.getContainerCondition();
  }

  public openDialog(element: INotes = null): void {
    const predicate = {
      width: '80vw',
      data: { item: this.creditProposalItem },
    };

    predicate.data['notes'] = element;

    const dialogRef = this.dialog.open(LoanAnalysDialogOpinionComponent, predicate);
  }
  public removefield() {
    this.pacth = this.router.url.split('/')[1];
    if (this.pacth === 'la-analyst' || this.pacth === 'la-approval-inquiry' || this.pacth === 'la-approval') {
      this.view = true;
    }
  }

  public readOnlyOffering() {
    this.route = this.activatedRoute.snapshot.data['offeringLetter'];
    if (this.route) {
      this.view = true;
    }
  }

  // set
  setApproval(event: any) {
    this.creditProposalItem.attributes['list'] = event;
  }

  public conditionOpinion() {
    // Opinion Condition in loan commite approval
    if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE' || this.creditProposalItem.statusId === 'CP_LOAN_APPROVAL') {
      // Manipulation in Label
      this.nameLabel = 'Approved Status';
      // Manipulation in radio button
      this.radioButtonPurpose = 'Approved With Propose';
      this.radioButtonCondition = 'Approved With Condition';
      this.radioButtonNotRecommend = 'Not Approved';
      // Manipulation in value
      this.valueRadioPurpose = 'Approved With Propose';
      this.valueRadioCondition = 'Approved With Condition';
      this.valueRadioRecommend = 'Not Approved';
    } else {
      // if outside the conditions url loan commite approval
      this.nameLabel = 'Recomendation';
      this.radioButtonPurpose = 'Recommend as Propose';
      this.radioButtonCondition = 'Recommend With Condition';
      this.radioButtonNotRecommend = 'Not Recommend';

      this.valueRadioPurpose = 'Recommend as propose';
      this.valueRadioCondition = 'Recommend With Condition';
      this.valueRadioRecommend = 'Not Recommend';
    }
  }

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
      const fileName = 'credit-proposal-remark-' + paramsId + '-opinion' + fileType + '.docs';
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
    console.log('cek', args);
    console.log('ini paste', args);
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }
  private getContainer(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/opinion/' + paramsId + '/sfdt',
    };
    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        console.log('abednege', obj);

        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-opinion-sfdt.sfdt');
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
  myFunction(value: string) {
    console.log('cek value', value);
  }

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  // Condition remark

  public triggeredSaveCondition(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/opinion/condition';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'credit-proposal-remark-' + paramsId + '-opinion' + '-condition' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'credit-proposal-remark-' + paramsId + '-opinion-' + '-condition-' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta('hana', formData, metaData).subscribe();
    });
  }
  public onKeyDownCondition(args: DocumentEditorKeyDownEventArgs): void {
    console.log('cek', args);
    console.log('ini paste', args);
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }
  private getContainerCondition(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/opinion/condition/' + paramsId + '/sfdt',
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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-opinion' + 'condition-sfdt.sfdt');
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

  onCreateCondition(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }
}
