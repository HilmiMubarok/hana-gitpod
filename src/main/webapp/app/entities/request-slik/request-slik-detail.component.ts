import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IRequestSlik } from './request-slik.model';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { RequestSlikService } from './request-slik.service';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { PartySlikService } from '../party-slik/party-slik.service';
import { IPDFSlik } from 'app/shared/ocr/pdf-slik.model';
import { IPartySlik, PartySlik } from '../party-slik/party-slik.model';
import { StorageService } from '../storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { RequestSlikStatusService } from './services/request-slik-status.service';

@Component({
  selector: 'jhi-request-slik-detail',
  templateUrl: './request-slik-detail.component.html',
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class RequestSlikDetailComponent implements OnInit {
  customHeadersJWT;
  paramsIdGet;
  getKey;
  ngOnInit(): void {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];
    this.getLovPurposeType();
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'request_slik_remarks/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        setTimeout(() => {
          this.getContainer();
        }, 1000);
      });
    });
  }

  // ngOnInit(): void {
  //   console.log({
  //     activatedRoute: this.activatedRoute.url[0],
  //     route: this.router.url.split('/'),
  //     test: requestSlikData.filter(res => res.cif === this.router.url.split('/')[2]),
  //   });
  //   this.activatedRoute.data.subscribe(res => (this.requestSlik = res.requestSlik));
  //   this.activatedRoute.data.subscribe(({ requestSlik }) => (this.requestSlik = requestSlik));
  // }

  // requestSlik$: Observable<IRequestSlik> | null = null;
  requestSlik: IRequestSlik | null = null;
  partyCif;
  isLoading: Boolean = true;
  checklists = [];
  result: any = [];
  requestSlikId: number;
  verifyData = [];
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  @ViewChild('document_editor_container')
  public documentEditor: DocumentEditorComponent;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private requestSlikService: RequestSlikService,
    protected messageService: MessageService,
    protected partySlikService: PartySlikService,
    protected storageService: StorageService,
    protected lovAndStatus: RequestSlikStatusService
  ) {
    // this.requestSlik$ = this.activatedRoute.data;
    // this.requestSlik = requestSlikData.filter(res => res.id === Number(this.router.url.split('/')[2]))[0];
    // this.partyCif = PARTY_CIF_EXAMPLE;
    this.requestSlikId = Number(this.router.url.split('/')[2]);
    this.requestSlikDetail();
  }

  requestSlikDetail() {
    this.requestSlikService.getDetail(this.requestSlikId).subscribe({
      next: res => {
        this.checklists = res.details.map(cheklist => {
          const obj = {
            idParty: cheklist.idParty,
            idRequestSlik: this.requestSlikId,
          };
          return obj;
        });
        this.requestSlik = res.slik;
        this.partyCif = res.partyCif;
      },
      complete: () => (this.isLoading = false),
    });
  }

  previousState(): void {
    window.history.back();
  }

  // Checklist
  // saveDetails(data: object[]) {
  // }

  // Get Lov Purpose Type
  purposeType;
  getLovPurposeType() {
    this.lovAndStatus.getLovProposeCode().subscribe(res => {
      this.purposeType = res;
      console.log('Asdasd', this.purposeType);
    });
  }

  submit() {
    // this.requestSlikService.onSubmit(this.requestSlikId, this.checkStatus(this.requestSlik.status));

    const ocr = {
      partyId: this.partyCif.partyId,
      cif: this.requestSlik.cif,
      name:
        this.partyCif.customerType === 'CORPORATE'
          ? this.partyCif.customerOrganization.groupName
          : this.partyCif.customerPerson.firstName + ' ' + this.partyCif.customerPerson.lastName,
      dob: this.partyCif.organizationLegal.deedEstablishDate,
      ktp: this.partyCif.customerType === 'CORPORATE' ? '' : this.partyCif.customerPerson.personalIdNumber,
      npwp:
        this.partyCif.customerType === 'CORPORATE'
          ? this.partyCif.customerOrganization.taxIdNumber
          : this.partyCif.customerPerson.taxIdNumber,
      gender: this.partyCif.customerType === 'CORPORATE' ? '' : this.partyCif.customerPerson.gender,
      custtype: this.partyCif.customerType === 'CORPORATE' ? '1' : '2',
      product: 'HR',
      channel: 'LOS',
      purposeCode: this.requestSlik.purposeCode,
    };

    const data = {
      id: this.requestSlikId,
      status: this.checkStatus(this.requestSlik.status).status,
      checklists: this.checklists,
      partyCif: this.partyCif,
      verifyData: this.verifyData,
      ocr,
      isSaved: this.isSaved,
    };

    this.requestSlikService.onSubmit(data).subscribe({
      next: () => {
        this.router.navigate(['/request-slik']);
      },
      error: err => {
        if (data.status === 'APPROVAL_BU' || data.status === 'APPROVAL_SLIK') {
          this.router.navigate(['/request-slik']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      complete: () => this.router.navigate(['/request-slik']),
    });
  }

  onSave() {
    return new Promise<void>((resolve, reject) => {
      // Put Request Slik -> Update purposeCode
      this.lovAndStatus.updateRequestSlik(this.requestSlik).subscribe();

      this.requestSlikService.saveDetails(this.checklists).subscribe();
      this.saveRemarks();
      resolve();
    });
  }

  setPurposeCode(ev) {
    this.requestSlik.purposeCode = ev.value;
    console.log(this.requestSlik);
  }

  isSaved: Boolean = false;
  save() {
    this.onSave().then(res => {
      this.isSaved = true;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save Success' });
    });
  }

  cancel() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.lovAndStatus.changeReqSlikStatus(this.requestSlikId, 'CANCEL').subscribe(() => this.router.navigate(['/request-slik']));
  }

  reject() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.lovAndStatus.changeReqSlikStatus(this.requestSlikId, 'RETURN_TO_RM').subscribe(() => this.router.navigate(['/request-slik']));
  }

  // === Document Editor ===
  onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  bucket: string;
  saveRemarks() {
    let paramsId = '';

    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    // const paramsId = this.requestSlikId;
    let key: string;
    this.getBucket().then(res => {
      key = 'request_slik_remarks';

      const timeStamp = Math.floor(Date.now() / 1000);

      const docEditor = this.container?.documentEditor as DocumentEditorComponent;

      if (docEditor !== undefined) {
        docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
          const fileType = 'word';
          const fileName = 'request-slik-remark-' + paramsId + '-' + fileType + '.docs';
          const metaData = {
            objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([exportedDocument], fileName));

          this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
        });

        docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
          const fileType = 'sfdt';
          const fileName = 'request-slik-remark-' + paramsId + '-' + fileType + '.sfdt';
          const metaData = {
            objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([exportedDocument], fileName));

          this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
        });
      }
    });
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

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  private ngUnsubscribe = new Subject();
  private fileGet: File;

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
              this.fileGet = new File([res.body], 'request-slik-remark-' + this.paramsIdGet + '-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                console.log('this container', this.documentEditor);

                const contents: string = e.target.result;
                console.log('COntents', { docEditor, contents, e });
                console.log('COntents', contents);
                console.log('DDSADASD', docEditor);
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }
  // === End Document Editor ===

  protected checkStatus(currentStatus: string) {
    if (currentStatus === 'DRAFT' || currentStatus === 'RETURN_TO_RM') {
      return {
        status: 'APPROVAL_BU',
      };
    } else if (currentStatus === 'APPROVAL_BU') {
      return {
        status: 'APPROVAL_SLIK',
      };
    } else if (currentStatus === 'APPROVAL_SLIK') {
      return {
        status: 'CHECKING',
      };
    } else if (currentStatus === 'VERIFY') {
      return {
        status: 'COMPLETE',
      };
    } else {
      return {
        status: 'COMPLETE',
      };
    }
  }

  protected containsObject(obj, list) {
    const res = _.find(list, function (val) {
      return _.isEqual(obj, val);
    });
    return _.isObject(res) ? true : false;
  }

  protected checkDuplicateVerifyData(obj, listVerifyData) {
    // check duplicate obj based on partyId
    const res = _.find(listVerifyData, function (val) {
      return _.isEqual(obj.partyId, val.partyId);
    });

    return _.isObject(res) ? true : false;
  }

  protected makePartySlikWithPartyId(data) {
    const partySlik = data.partySlik;
    const partyId = data.partyId;
    const reqReffId = data.requestReffId;

    // add partyId to partySlik
    partySlik.partyId = partyId;

    // add reqReffId to partySlik
    partySlik.reqReffId = reqReffId;

    return partySlik;
  }

  private mapperIPDFSlikToPartySlik(item: any): IPartySlik {
    const partySlik: IPartySlik = new PartySlik();
    partySlik.attributes = {
      partySlikCollaterals: item.partySlikCollaterals,
      reqReffId: item.reqReffId,
    };
    partySlik.partyId = item.partyId;
    partySlik.bank = item.bank;
    partySlik.limit = item.limit === null ? 0 : Number(item.limit.toString().replace(/\./g, ''));
    partySlik.rate = item.rate == null ? 0 : Number(item.rate.toString().replace(' %', ''));
    partySlik.tenor = item.tenor == null ? 0 : Number(item.tenor.toString().replace(' bulan', ''));
    partySlik.outstanding = item.outstanding == null ? 0 : Number(item.outstanding.toString().replace(/\./g, ''));
    partySlik.collateralIdrMio = item.collateralIdrMio == null ? 0 : Number(item.collateralIdrMio.toString().replace(/\./g, ''));
    partySlik.restructureFrequency = item.frekuensiRestrukturasi == null ? 0 : Number(item.frekuensiRestrukturasi);
    partySlik.arrearsFrequency = item.frekuensiTunggakan == null ? 0 : Number(item.frekuensiTunggakan);
    partySlik.arrearsBase = item.tunggakanPokok == null ? 0 : Number(item.tunggakanPokok);
    partySlik.arrearsInterest = item.tunggakanBunga == null ? 0 : Number(item.tunggakanBunga);
    partySlik.arrearsReason = item.sebabMacet;
    partySlik.lastCollectability = item.kolTerakhir == null ? 0 : Number(item.kolTerakhir.substring(0, 1));
    partySlik.worstCollectability = item.kolTerburuk == null ? 0 : Number(item.kolTerburuk.substring(0, 1));
    partySlik.collateralType = item.collateralType == null ? '' : item.collateralType;
    partySlik.facilityType = item.facilityType;
    partySlik.period = item.period;
    // ! Penambahan Field Party Slilk disini =====
    partySlik.debtorName = item.debtorName;
    partySlik.bankPelapor = item.bankPelapor;
    partySlik.tanggalAkadAwal = item.tanggalAkadAwal;
    partySlik.tanggalMulai = item.tanggalMulai;
    partySlik.tanggalJatuhTempo = item.tanggalJatuhTempo;
    partySlik.kondisi = item.kondisi;
    partySlik.totalAgunan = item.totalAgunan;
    partySlik.sumCollateralIdrMio = item.sumCollateralIdrMio;
    partySlik.typeOfFacility = item.typeOfFacility;
    partySlik.plafond = item.plafond;

    return partySlik;
  }

  protected getSelectedVerifyData(ev) {
    const partySlikWithPartyId = this.makePartySlikWithPartyId(ev);
    // check if ev is already in verifyData based on partyId
    !this.checkDuplicateVerifyData(partySlikWithPartyId, this.verifyData) && this.verifyData.push(partySlikWithPartyId);

    // Loop over verifyData and update partySlikCollaterals
    this.verifyData.forEach(res => {
      res.partySlikCollaterals = JSON.stringify(res.partySlikCollaterals);
    });

    // Map over verifyData and create new objects with attributes key
    this.verifyData = this.verifyData.map(res => {
      // ! add reqreffid disini harusnya
      console.log('Req reff id', res);

      // party_slik / cbas / { reqReffId }-- > source;

      // party_slik / partyId / slik_date.pdf-- > target;

      // this.requestSlikService.CopasSlikFile(res.partyId, res.reqReffId, `party_slik/cbas`, `party_slik`);

      // Destructure res and omit partySlikCollaterals key
      const finalVerifyData = this.mapperIPDFSlikToPartySlik(res);
      // const { partySlikCollaterals, ...rest } = res;

      // Return new object with attributes key
      return finalVerifyData;
      // return {
      //   ...rest,
      //   attributes: {
      //     partySlikCollaterals,
      //   },
      // };
    });
  }

  protected getChecklistManagementData(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }
  }

  checklistData;
  updateChecklist(ev, check) {
    const data = {
      idParty: null,
      idRequestSlik: null,
    };
    data.idParty = this.partyCif.partyId;
    data.idRequestSlik = this.requestSlikId;
    if (check.checked) {
      // ketika cek
      !this.containsObject(data, this.checklists) && this.checklists.push(data);
    } else {
      // ketika uncek

      // get checklist data by requestSlikId
      this.requestSlikService.getChecklistData(true, this.requestSlikId).subscribe(checklistData => {
        // get data where partyId === data.idParty
        const resChecklistData = checklistData.body.data.filter(res => res.idParty === data.idParty);

        resChecklistData.forEach(checklist => {
          // remove checklist
          this.requestSlikService.removeChecklist(checklist.id).subscribe();
        });
      });

      this.containsObject(data, this.checklists) && _.remove(this.checklists, { idParty: data.idParty });
    }
  }

  isDetailChecked(row) {
    return this.requestSlikService.isDetailChecked(row, this.checklists, 'debitur');
  }

  protected getChecklistShareholder(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }
  }

  protected getChecklistOther(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }
  }
}
