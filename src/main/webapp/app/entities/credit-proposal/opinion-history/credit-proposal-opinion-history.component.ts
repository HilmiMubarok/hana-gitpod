import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { PositionService } from 'app/entities/position/position.service';
import { INotes } from 'app/entities/notes/notes.model';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import { CreditProposalDialogOpinionHistoryComponent } from './dialog-opinion-history/credit-proposal-dialog-opinion-history.component';

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
  selector: 'jhi-credit-proposal-opinion-history',
  templateUrl: './credit-proposal-opinion-history.component.html',
  styleUrls: ['./opinion-history.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalOpinionHistoryComponent implements OnInit {
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  @Output() newItemEvent = new EventEmitter<string>();
  @Output() uuidPath = new EventEmitter<string>();

  @ViewChild('document_editor_container')
  private container: DocumentEditorContainerComponent;
  @ViewChild('document_editor_container_condition')
  private container_condition: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  private documentEditor: DocumentEditorComponent;

  public notes: INotes[];
  public recomendasi: string;

  private _creditProposalItem: ICreditProposal;
  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  private positionLogin: any;
  private uuid: any;

  constructor(
    protected datePipe: DatePipe,
	protected dialog: MatDialog,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected storageService: StorageService,
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService
  ) {
	this.uuid = uuid.v4();
  }

  private getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
    });
  }

  private filterPositionLogin() {
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionLogin = posisi.body;
      for (let i = 0; i < this.positionLogin.length; i++) {
        this.creditProposalItem.attributes['positionLogin'] = this.positionLogin[i].id;
      }
	  this.refresh();
    });
  }

  ngOnInit(): void {
	this.uuidPath.emit(this.uuid);

	this.getWord();
    this.filterPositionLogin();
  }

  public change(event: string) {
    this.newItemEvent.emit(event);
    this.recomendasi = event;
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

  public triggeredSave(): void {
	let paramsId = '';

	this.activatedRoute.params.subscribe(params => {
	  paramsId = params['id'];
	});

	const key = 'credit_proposal/remark/opinion-history/opinion';

	const timeStamp = Math.floor(Date.now() / 1000);

	const docEditor = this.container?.documentEditor as DocumentEditorComponent;

	docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
	  const fileType = 'word';
	  const pathHelper = this.uuid + '-opinion';
	  const fileName = this.uuid + '.docs';
	  const metaData = {
		objectName: `${key}/${paramsId}/${pathHelper}/${fileType.replace('&','')}/${fileName}`,
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
		objectName: `${key}/${paramsId}/${pathHelper}/${fileType.replace('&','')}/${fileName}`,
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
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  public onCreate(): void {
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  public triggeredSaveCondition(): void {
	let paramsId = '';

	this.activatedRoute.params.subscribe(params => {
	  paramsId = params['id'];
	});

	const key = 'credit_proposal/remark/opinion-history/condition';

	const timeStamp = Math.floor(Date.now() / 1000);

	const docEditor = this.container_condition?.documentEditor as DocumentEditorComponent;

	docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
	  const fileType = 'word';
	  const pathHelper = this.uuid + '-condition';
	  const fileName = this.uuid + '.docs';
	  const metaData = {
		objectName: `${key}/${paramsId}/${pathHelper}/${fileType.replace('&','')}/${fileName}`,
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
		objectName: `${key}/${paramsId}/${pathHelper}/${fileType.replace('&','')}/${fileName}`,
	  };
	  const formData = new FormData();
	  formData.append('file', new File([exportedDocument], fileName));

	  this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
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

  public onCreateCondition(): void {
    this.container_condition.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
  }

  public refresh() {
	this.creditProposalService.find(this.creditProposalItem.id).subscribe(res => {
	  this.notes = res.body.notes;

	  if (this.notes) {
		if (this.notes.length > 0) {
		  this.notes.sort((a, b) => (a.id > b.id) ? 1 : -1);
		}
	  }
	  
	  let index = 0;
	  for (const note of [...notes]) {
		if (note.type === 'loan_analysis' || note.type === 'loan_committee' || note.type === 'compliance' || note.type === '' || note.type === null) {
          notes.splice(index, 1);
		} else {
          ++index;
		}
	  }
	});
  }
}