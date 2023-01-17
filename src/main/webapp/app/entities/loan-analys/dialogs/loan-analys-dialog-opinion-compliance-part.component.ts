import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentEditorComponent, DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';
import { AccountService } from 'app/core/auth/account.service';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Component({
  selector: 'jhi-loan-analys-dialog-opinion-compliance-part',
  templateUrl: './loan-analys-dialog-opinion-compliance-part.component.html',
  styleUrls: ['./loan-analys-dialog-opinion.css'],
})
export class LoanAnalysDialogOpinionCompliancePartComponent implements OnInit {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public notes: any;

  creditProposalItem: ICreditProposal;

  private ngUnsubscribe = new Subject();
  private fileGet: File;
  public resourceUrl: string;
  private BUCKET: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
      item: ICreditProposal;
    },
    _dialog: MatDialogRef<LoanAnalysDialogOpinionCompliancePartComponent>,
    protected router: Router,
    private storageService: StorageService,
    protected activatedRoute: ActivatedRoute,
    public accountService: AccountService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {
	const tempNotes = this.dataNotes.notes;
    this.creditProposalItem = this.dataNotes.item;
	for (let i = 0; i < this.creditProposalItem.notes.length; i++) {
	  if (this.creditProposalItem.notes[i].userId === tempNotes['userId'] && this.creditProposalItem.notes[i].positionUserId === tempNotes['positionUserId']) {
		this.notes = this.creditProposalItem.notes[i];
	  }
	}
  }

  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    this.conditionOpinion();
    this.getWord();
  }

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
    });
  }

  private getContainer(): void {
    const obj = {
      key: 'credit_proposal/remark/opinion-history/compliance/opinion/' + this.creditProposalItem.id + '/' + this.notes['condition'] + + '-opinion/sfdt',
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
                [res.body], this.notes['condition'] + '.sfdt'
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
  }
}
