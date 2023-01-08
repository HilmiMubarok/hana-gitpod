import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { AccountService } from 'app/core/auth/account.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
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
import { PositionService } from 'app/entities/position/position.service';
import { IPosition } from 'app/entities/position/position.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { INotes } from 'app/entities/notes/notes.model';
import _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Component({
  selector: 'jhi-loan-analys-opinion',
  templateUrl: './loan-analys-opinion.component.html',
  styleUrls: ['./loan-analys-opinion.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class LoanAnalysOpinionComponent implements OnInit, OnChanges {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor_container_condition')
  public container_condition: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public _creditProposalItem: ICreditProposal;
  public notes: any;
  public route: any;
  public parentPath = this.router.url.split('/')[1];
  public position: IPosition[];

  public nameLabel: any;
  public radioButtonPurpose: any;
  public radioButtonCondition: any;
  public radioButtonNotRecommend: any;
  public valueRadioPurpose: any;
  public valueRadioCondition: any;
  public valueRadioRecommend: any;
  public resourceUrl: string;
  private fileGet: File;
  public currentAccount: any;

  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  public userId: string;
  public accountLogin: any;
  public positionUserId: string;
  public obj: any;
  public InternalId: any;
  public positionLogin: any;

  public recomendasi: string;
  private positionLoanComitee: string;

  @Input() cp: ICreditProposal;
  @Input() saveWordMinio;
  @Input() saveWordOpinionCondition;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  @Output() newItemEvent = new EventEmitter<string>();
  @Output() positionLoginEmit = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cp.currentValue.notes.length > 0) {
      this.notes = lodash.cloneDeep(changes.cp.currentValue.notes);
      for (let i = 0; i < this.notes.length; i++) {
        this.notes[i].message = this.notes[i].message ? this.notes[i].message.replace(/<(?:.|\n)*?>/gm, '') : '';
        this.notes[i].condition = this.notes[i].condition ? this.notes[i].condition.replace(/<(?:.|\n)*?>/gm, '') : '';
        this.notes[i].createDate = this.notes[i].createDate ? this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd') : '';
        this.notes[i].recomendation = this.notes[i].recomendation ? this.notes[i].recomendation.replace(/<(?:.|\n)*?>/gm, '') : '';
      }
    }
  }

  constructor(
    public accountService: AccountService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    private storageService: StorageService,
    private positionService: PositionService,
    private creditProposalService: CreditProposalService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    this.getLogin();
    this.filterPositionLogin();
    this.getWord();
    this.refresh();

    this.conditionOpinion();
    this.conditionEnableOpinion();
    this.hiddenApprovalUser();
    this.loadPosition(['HCR1', 'HCR2', 'FINANCE_DIR', 'BUSINESS_DIR', 'CREDIT_DIR']);
  }

  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
    });
  }

  public getLogin() {
	this.accountService.identity().subscribe(account => {
	  this.userId = account.login;
	});
  }

  public openDialog(element: INotes = null): void {
    const predicate = {
      width: '80vw',
      data: { item: this.creditProposalItem },
    };

    predicate.data['notes'] = element;

    const dialogRef = this.dialog.open(LoanAnalysDialogOpinionComponent, predicate);
  }  

  public change(event: string){
    this.newItemEvent.emit(event);
  }

  setApproval(event: any) {
    for (let i = 0; i < this.position.length; i++) {
      if (event.value === this.position[i].employeeFirstName) {
        this.creditProposalItem.attributes['userId'] = this.position[i].employeeFirstName;
        this.creditProposalItem.attributes['position'] = this.position[i].positionTypeDescription;
      }
	  this.positionLoanComitee = this.creditProposalItem.attributes['position'];
      // this.positionUserId = this.creditProposalItem.attributes['position'];
    }
  }

  public conditionOpinion() {
    // Opinion Condition in loan commite approval
    if (this.creditProposalItem.statusId === 'CP_LOAN_APPROVAL' || this.creditProposalItem.statusId === 'LA_DAR_NOTIF') {
      // Manipulation in Label
      this.nameLabel = 'Approved Status';
      // Manipulation in radio button
      this.radioButtonPurpose = 'Approved as Propose';
      this.radioButtonCondition = 'Approved With Condition';
      this.radioButtonNotRecommend = 'Not Approved';
      // Manipulation in value
      this.valueRadioPurpose = 'Approved as Propose';
      this.valueRadioCondition = 'Approved With Condition';
      this.valueRadioRecommend = 'Not Approved';
    } else if (this.creditProposalItem.statusId !== 'CP_LOAN_COMMITTEE') {
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

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  onDocumentChanges() {
    this.container_condition.restrictEditing = true;
  }

  public disabledOpinion: boolean;

  public conditionEnableOpinion() {
    if (
      this.creditProposalItem.statusId === 'CP_ASSIGNMENT' ||
      this.creditProposalItem.statusId === 'CP_CHECKER' ||
      this.creditProposalItem.statusId === 'CP_LOAN_APPROVAL' ||
      this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE' ||
      this.creditProposalItem.statusId === 'LA_DAR_NOTIF'
    ) {
      this.disabledOpinion = false;
    } else {
      this.disabledOpinion = true;
    }
  }

  public approvalUser: boolean;

  private hiddenApprovalUser() {
    if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
      this.approvalUser = false;
    } else {
      this.approvalUser = true;
    }
  }

  public triggeredSave(): void {
	this.positionService.findByLogin().subscribe(posisi => {
	  if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
		this.positionUserId = this.positionLoanComitee;
	  } else {
		this.positionUserId = posisi.body[0].name;
	  }
	  
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
          'credit-proposal-remark-' + paramsId + '-' + this.positionUserId.replace('&', '') + '-' + this.userId.replace('&', '') + '-opinion-' + fileType + '.docs';
		const metaData = {
          objectName: `${key}/${paramsId}/${this.positionUserId.replace('&', '')}-${this.userId.replace('&', '')}/${fileType}/${fileName}`,
		};
		const formData = new FormData();
		formData.append('file', new File([exportedDocument], fileName));
		this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
		const fileType = 'sfdt';
		const fileName =
          'credit-proposal-remark-' + paramsId + '-' + this.positionUserId.replace('&', '') + '-' + this.userId.replace('&', '') + '-opinion-' + fileType + '.sfdt';
		const metaData = {
          objectName: `${key}/${paramsId}/${this.positionUserId.replace('&', '')}-${this.userId.replace('&', '')}/${fileType}/${fileName}`,
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
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  // Remark Minio

  private getContainer(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/opinion-history/opinion/' + paramsId + '/' + this.positionUserId.replace('&', '') + '-' + this.userId.replace('&', '') + '/sfdt',
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
                'credit-proposal-remark-' + paramsId + '-' + this.positionUserId.replace('&', '') + '-' + this.userId.replace('&', '') + '-opinion-sfdt.sfdt'
              );
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
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    // this.container.documentEditor.openBlank();
  }

  // Condition remark

  public triggeredSaveCondition(): void {
	this.positionService.findByLogin().subscribe(posisi => {
	  if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
		this.positionUserId = this.positionLoanComitee;
	  } else {
		this.positionUserId = posisi.body[0].name;
	  }
	  
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
          paramsId +
          '-' +
          this.positionUserId.replace('&', '') +
          '-' +
          this.userId.replace('&', '') +
          '-opinion' +
          '-condition-' +
          fileType +
          '.docs';
		const metaData = {
			objectName: `${key}/${paramsId}/${this.positionUserId.replace('&', '')}-${this.userId.replace('&', '')}/${fileType}/${fileName}`,
		};
		const formData = new FormData();
		formData.append('file', new File([exportedDocument], fileName));

		this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
		const fileType = 'sfdt';
        const fileName =
		  'credit-proposal-remark-' +
          paramsId +
          '-' +
          this.positionUserId.replace('&', '') +
          '-' +
          this.userId.replace('&', '') +
          '-opinion' +
          '-condition-' +
          fileType +
          '.sfdt';
		const metaData = {
		  objectName: `${key}/${paramsId}/${this.positionUserId.replace('&', '')}-${this.userId.replace('&', '')}/${fileType}/${fileName}`,
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
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/opinion-history/condition/' + paramsId + '/' + this.positionUserId.replace('&', '') + '-' + this.userId.replace('&', '') + '/sfdt',
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
                  this.positionUserId.replace('&', '') +
                  '-' +
                  this.userId.replace('&', '') +
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
  }

  onCreateCondition(): void {
    this.container_condition.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    // this.container_condition.documentEditor.openBlank();
  }

  public loadPosition(position: any): void {
    this.positionService.queryFilterByNew({ idPositionTypes: position, size: 9999, page: 0 }).subscribe(res => {
      this.position = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });
    });
  }

  public filterPositionLogin() {
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionLogin = posisi.body;
      for (let i = 0; i < this.positionLogin.length; i++) {
        this.creditProposalItem.attributes['positionLogin'] = this.positionLogin[i].positionTypeDescription;
		this.positionLoginEmit.emit(this.positionLogin[i].positionTypeDescription);
      }
    });
  }

  public refresh() {
    this.creditProposalService.find(this.creditProposalItem.id).subscribe(res => {
      this.notes = res.body.notes;
      if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
        this.creditProposalItem.attributes['tempLoggedInNotes'] = '';
        this.creditProposalItem.attributes['tempLoggedInCondition'] = '';
        this.creditProposalItem.attributes['position'] = '';
        if (this.notes.length > 0) {
          for (let i = 0; i < this.notes.length; i++) {
            this.notes[i].createDate = this.notes[i].createDate ? this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd') : '';
			this.creditProposalItem.attributes['tempLoggedInNotes'] = '';
			this.creditProposalItem.attributes['position'] = this.notes[i].positionUserId;
			this.creditProposalItem.attributes['tempLoggedInRecomendationUser'] = this.notes[i].recomendation;
          }
        }
      } else {
        this.accountService.identity().subscribe(account => {
          this.currentAccount = account;
          this.creditProposalItem.attributes['tempLoggedInNotes'] = '';
          this.creditProposalItem.attributes['tempLoggedInRecomendation'] = '';
          this.creditProposalItem.attributes['tempLoggedInCondition'] = '';
          this.creditProposalItem.attributes['positionLogin'] = '';
          if (this.notes.length > 0) {
            for (let i = 0; i < this.notes.length; i++) {
              this.notes[i].createDate = this.notes[i].createDate ? this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd') : '';
              if (this.notes[i].userId === this.currentAccount.login) {
                this.creditProposalItem.notes[i].message = '';
                this.creditProposalItem.attributes['tempLoggedInNotes'] = '';
                this.creditProposalItem.attributes['tempLoggedInRecomendation'] = this.notes[i].recomendation;
				this.recomendasi = this.notes[i].recomendation;
                this.creditProposalItem.attributes['positionLogin'] = this.notes[i].positionUserId;
                this.creditProposalItem.attributes['tempLoggedInCondition'] = '';
              }
            }
          }
        });
      }
    });
  }
}
