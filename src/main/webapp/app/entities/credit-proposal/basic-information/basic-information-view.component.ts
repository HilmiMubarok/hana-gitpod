import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { IPartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { ICreditProposal, CreditProposal } from '../credit-proposal.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import {
  IPartyPostalAddressWarehouse,
  PartyPostalAddressWarehouse,
} from 'app/entities/party-postal-address/party-postal-address-warehouse.model';
import { PURPOSE_TYPE } from 'app/shared/constants/base.constants';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import lodash from 'lodash';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  SelectionService,
  EditorService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class ProposalBasicInformationViewComponent implements OnInit {
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  // The Dialog shows within the target element.
  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
  // remarks
  @ViewChild('document_editor_container')
  public containers: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  private bucket: string;
  public customHeadersJWT: any;
  private paramsIdGet: string;
  private getKey: string;
  private ngUnsubscribe = new Subject();
  private fileGet: File;

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  @Input()
  public proposalType: string;

  public data: any[] = [];
  public watchList: any;
  public route: any;
  public partyCif: IPartyCif;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private partyCifService: PartyCifService,
    public dialog: MatDialog,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    // remarks
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/basic-info/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });

    this.data = this.creditProposal.attributes['basicInformation'].coborowed;
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });

    this.generalLocation = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'DOMICILE_LOCATION';
    });
    this.warehouseLocation = this.creditProposal.addresses.find(obj => obj.purposeTypeId === PURPOSE_TYPE.WAREHOUSE);
    if (this.warehouseLocation === undefined) {
      this.warehouseLocation = new PartyPostalAddressWarehouse();
      this.warehouseLocation.purposeTypeId = PURPOSE_TYPE.WAREHOUSE;
    } else {
      this.warehouseLocation = this.creditProposal.addresses.find(function (e) {
        return e.purposeTypeId === 'WAREHOUSE_LOCATION';
      });
    }

    this.watchListChange();
    this.hiddenData();
    this.setBusinessGroup();
  }

  // remarks

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

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      args.isHandled = true;
    }
  }

  onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.containers.serviceUrl = '/services/los/api/wordeditor/';
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/basic-info';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.containers?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'credit-proposal-remark-' + paramsId + '-basic-info' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'credit-proposal-remark-' + paramsId + '-basic-info' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
    });
  }

  // remarks

  private getContainer(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/basic-info/' + paramsId + '/sfdt',
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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-basic-info-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.containers?.documentEditor as DocumentEditorComponent;
                const contents: string = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }

  public addItem(event: any) {
    const partyPostalAddress: IPartyPostalAddress = lodash.find(event[0].addresses, function (o) {
      return o.purposeTypeId === 'PRIMARY_LOCATION';
    });

    const nomer = this.data.length + 1;

    if (event[0].customerPerson === null) {
      const dataSet = {
        no: nomer,
        customerNumber: event[0].customerNumber,
        name: event[0].customerOrganization.name,
        taxIdNumber: event[0].customerOrganization.taxIdNumber,
        address: partyPostalAddress.address.address1,
      };

      this.data = [...this.data, dataSet];
    } else {
      const dataSet = {
        no: nomer,
        customerNumber: event[0].customerNumber,
        name: event[0].customerPerson.name,
        taxIdNumber: event[0].customerPerson.taxIdNumber,
        address: partyPostalAddress.address.address1,
      };

      this.data = [...this.data, dataSet];
    }

    this.creditProposal.attributes['basicInformation'].coborowed = this.data;
    this.ejDialog.hide();
  }

  public warehouseLocation: IPartyPostalAddressWarehouse;
  public postalAdresss: IPartyPostalAddress;
  public generalLocation: IPartyPostalAddress;
  public gridCreditProposal: any = [];
  public dialogVisibility = false;
  // Sample level code to handle the button click action
  public onOpenDialog(event: any): void {
    // Call the show method to open the Dialog
    this.ejDialog.show();
  }
  // Sample level code to hide the Dialog when click the Dialog overlay
  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  public displayedColumns: string[] = ['no', 'customerNumber', 'name', 'taxIdNumber', 'address', 'action'];

  watchListChange() {
    if (
      this.creditProposal.attributes['basicInformation'].accountStatus.watchList === true ||
      this.creditProposal.attributes['basicInformation'].accountStatus.restructured === true
    ) {
      this.watchList = false;
    } else if (
      this.creditProposal.attributes['basicInformation'].accountStatus.watchList === false &&
      this.creditProposal.attributes['basicInformation'].accountStatus.restructured === false
    ) {
      this.watchList = true;
    }
  }
  public view: boolean;
  public hiddenData() {
    const route = this.router.url.split('/')[1];

    if (route === 'cp-status-approval') {
      this.view = true;
    } else {
      this.view = false;
    }
  }
  // Delete Confirmation
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40vw',
      data: {
        title: 'Delete Co-Borrower Info Data',
        message: 'Are you sure to delete ' + element.name + ' company with CIF number ' + element.customerNumber + '?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGrid = this.data.filter(({ customerNumber }) => customerNumber !== element.customerNumber);
        this.data = dataGrid;
        this.creditProposal.attributes['basicInformation'].coborowed = dataGrid;
      }
    });
  }

  // public onDelete(element: any) {
  //   const dataGrid = this.data.filter(({ customerNumber }) => customerNumber !== element.customerNumber);
  //   this.data = dataGrid;
  //   this.creditProposal.attributes['basicInformation'].coborowed = dataGrid;
  // }

  public setBusinessGroup() {
    const cifNumber = this.creditProposal?.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.gridCreditProposal = res.body;
    });
  }

  public onDocumentChange() {
    this.containers.restrictEditing = true;
  }
}
