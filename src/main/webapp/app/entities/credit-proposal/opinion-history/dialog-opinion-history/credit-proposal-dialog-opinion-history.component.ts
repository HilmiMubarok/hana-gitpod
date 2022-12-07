import { Component, Inject, SimpleChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-dialog-opinion-history',
  templateUrl: './credit-proposal-dialog-opinion-history.component.html',
  styleUrls: ['../opinion-history.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalDialogOpinionHistoryComponent implements OnInit {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public notes: any;
  public creditProposalItem: ICreditProposal;
  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
      creditProposalItem: ICreditProposal;
    },
    _dialog: MatDialogRef<CreditProposalDialogOpinionHistoryComponent>,
    private storageService: StorageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.notes = this.dataNotes.notes;
    this.creditProposalItem = this.dataNotes.creditProposalItem;
  }
  ngOnInit(): void {
    this.bucket = 'hana';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/opinion/' + this.creditProposalItem.id + '/sfdt';
      this.getContainer();
    });
  }
  onDocumentChange() {
    this.container.restrictEditing = true;
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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.creditProposalItem.id + '-opinion-sfdt.sfdt');
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
}
