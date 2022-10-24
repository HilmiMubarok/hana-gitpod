import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import moment from 'moment';
import { StorageService } from 'app/entities/storage/storage.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { ILoanAnalysSlikIdeb } from 'app/entities/credit-proposal/slik-summary/ideb/loan-analys-slik-ideb.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { formatBytes } from 'app/shared/helper/utils';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'jhi-debtor-data-slik-ideb',
  templateUrl: './debtor-data-ideb.component.html',
  styleUrls: ['./loan-analys-slik-ideb.css'],
})
export class DeborDataSlikIdebComponent implements OnChanges {
  constructor(
    private storageService: StorageService,
    private creditProposalService: CreditProposalService,
    private accountService: AccountService
  ) {}

  public loanAnalys: ILoanAnalysSlikIdeb;
  public file: File = null;
  public isDataExist = false;
  public isLoadFile = false;
  public document: any = '';
  public service = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
  private _partyCif: IPartyCif;
  atasNama: any;
  data: any;
  dataKey: any;
  id: any;
  isLoading = false;
  sizeFile: string;
  storageBucket: any;
  bucket: string;

  @ViewChild('dropdownlistdata')
  public dropDownListObject: DropDownListComponent;

  @ViewChild('uploader')
  public uploader: ElementRef;

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(data: IPartyCif) {
    this._partyCif = data;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.creditProposal) {
      this.partyCif = changes.creditProposal.currentValue;
      this.storageService.getBucketName().subscribe(val => {
        this.bucket = val.body['bucket'];
        this.getFile(this.partyCif.id);
      });
    }
  }

  public selectFile($event: { target: HTMLInputElement }): void {
    this.file = $event.target.files[0];
    this.previewFile(this.file);
    this.sizeFile = formatBytes(this.file.size);
  }

  public previewFile(file) {
    if (file.url) {
      this.dropDownListObject.value = file.tags.data;
      this.atasNama = file.tags.atasNama;
      this.isLoadFile = true;
      this.getBaseFromUrl(file.url).then(res => {
        this.isLoadFile = false;
        this.isDataExist = true;
        this.dataKey = file.key;
        this.document = res;
        const viewer = (<any>document.getElementById('pdfViewer')).ej2_instances[0];
        viewer.load(this.document, null);
      });
    } else {
      const documents = file as Blob;
      const reader = new FileReader();
      reader.readAsDataURL(documents);
      reader.onload = () => {
        this.document = reader.result;
        const viewer = (<any>document.getElementById('pdfViewer')).ej2_instances[0];
        viewer.load(this.document, null);
      };
    }
  }

  public async getBaseFromUrl(url: string) {
    const data = await fetch(url);
    const blob = await data.blob();

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }

  public onClear() {
    this.file = null;
    this.uploader.nativeElement.value = '';
    this.document = '';
    this.data = '';
    this.atasNama = '';
    this.dropDownListObject.value = null;
    this.isLoading = false;
    const viewer = (<any>document.getElementById('pdfViewer')).ej2_instances[0];
    viewer.unload();
  }

  public onUpload() {
    this.isLoading = true;
    this.save();
  }

  public deleteFile() {
    this.storageService.deleteFile(this.bucket, this.dataKey).subscribe(d => {
      this.getFile(this.partyCif.id);
      this.onClear();
    });
  }

  public save() {
    const currentDate = moment().format('YYYYMMDDHHMMSSMS');
    const metaData = {
      objectName: `partyCif/slik_ideb/${this.partyCif.id}/document/${currentDate}.${this.file.name}`,
      entityId: this.partyCif.id,
      data: this.data,
      atasNama: this.atasNama,
      createdDate: new Date(),
      createdBy: '',
    };

    this.accountService.identity().subscribe(data => (metaData.createdBy = data.login));

    const formData = new FormData();
    formData.append('file', this.file);

    this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res => {
      this.isLoading = false;
      this.onClear();
      this.getFile(this.partyCif.id);
      this.isDataExist = true;
    });
  }

  private getFile(id: number): void {
    const predicate: Object = {
      key: `/partyCif/slik_ideb/${id}/document`,
    };
    this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
      if (res.body.length > 0) {
        const data = Object.assign({}, res.body[0]);
        this.previewFile(data);
      } else {
        this.isDataExist = false;
      }
    });
  }
}
