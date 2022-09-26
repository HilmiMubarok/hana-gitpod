import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SelectedEventArgs, UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { AccountService } from 'app/core/auth/account.service';
import moment from 'moment';
import { StorageService } from 'app/entities/storage/storage.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ILoanAnalysSlikIdeb } from './loan-analys-slik-ideb.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreditProposalResolve } from 'app/entities/credit-proposal/credit-proposal.route';
import { ActivatedRoute } from '@angular/router';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';

@Component({
  selector: 'jhi-loan-analys-slik-ideb',
  templateUrl: './loan-analys-slik-ideb.component.html',
  styleUrls: ['./loan-analys-slik-ideb.css'],
})
export class LoanAnalysSlikIdebComponent implements AfterViewInit, OnChanges {
  public loanAnalys: ILoanAnalysSlikIdeb;
  public file: File;
  id: any;

  isLoading = false; // Flag variable
  sizeFile: string;
  storageBucket: any;
  bucket: string;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private creditProposalService: CreditProposalService
  ) {
    this.loanAnalys = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  private _creditProposal: ICreditProposal;

  @ViewChild('uploader')
  public uploader: ElementRef;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.creditProposal) {
      this.creditProposal = changes.creditProposal.currentValue;
      // this.storagegetBucketName().then(val => {
      //   this.getFilesByKey(`/appraisals/${this.appraisalId}/jaminan`);
      // });
    }
  }

  @ViewChild('defaultupload')
  public fileUpload: UploaderComponent;

  public path: Object = {
    saveUrl: this.save(),
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
  };

  public urlfile: any;
  public document: any = '';
  public service = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
  atasNama: any;
  data: any;
  public onSelect(event: SelectedEventArgs) {
    const documents = event.filesData.map(fileInfo => fileInfo.rawFile as Blob)[0];
    const reader = new FileReader();
    reader.readAsDataURL(documents);
    reader.onload = () => {
      this.document = reader.result;
      const viewer = (<any>document.getElementById('pdfViewer')).ej2_instances[0];
      viewer.load(reader.result, null);
    };
  }

  public onUploadSuccess(args: any): void {
    // if (args.operation === 'upload') {
    //   console.log('File uploaded successfully');
    // }
    console.log(args);
  }

  ngAfterViewInit(): void {
    console.log('files data, ', this.fileUpload.upload(this.fileUpload.getFilesData()));
  }

  public onUploadFailure(args: any): void {
    console.log(args);
    // console.log('File failed to upload');
  }

  public save() {
    const metaData = {
      objectName: null,
      entityId: null,
      data: null,
      atasNama: null,
      createdDate: null,
      createdBy: null,
    };
    const currentDate = moment().format('YYYYMMDDHHMMSSMS');

    // metaData.objectName = `/credit_proposal/slik_ideb/${this.data.creditProposal.id}/document/${currentDate}-${this.file.name}`;
    // metaData.entityId = this.data.creditProposal.id;
    metaData.data = this.data;
    metaData.atasNama = this.atasNama;
    metaData.createdDate = new Date();

    const formData = new FormData();
    formData.append('file', this.file);

    console.log({
      metaData,
      formData,
    });
    return 'https://ej2.syncfusion.com/services/api/uploadbox/Save';

    // this.accountService.identity().subscribe(resAccount => {
    //   metaData.createdBy = resAccount.login;
    //   this.storageService.uploadMeta(this.data.bucket, formData, metaData).subscribe(res => {
    //     console.log('res after storageservice upload', res);
    //   });
    // });
  }

  public uploadTo() {
    this.save();
  }

  onProgress(event: any) {
    console.log(event);
  }
}
