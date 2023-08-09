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
import { IPartySlik, PartySlik } from '../party-slik/party-slik.model';
import { StorageService } from '../storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { RequestSlikStatusService } from './services/request-slik-status.service';
import { IInternal } from '../internal/internal.model';
import { InternalService } from '../internal/internal.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IRequestSlikNote, RequestSlikPopupComponent } from './dialogs/request-slik-popup.component';
import { AccountService } from 'app/core/auth/account.service';
import { RequestSlikTimelineService } from './services/request-slik-timeline.service';
import { RequestSlikValidateService } from './services/request-slik-validate.service';
import { PartyCifService } from '../party-cif/party-cif.service';
import { RequestSlikChecklistService } from './services/request-slik-checklist.service';
import { RequestSlikStatus } from './enums/request-slik-status.enum';
import { TemplateService } from 'app/layouts/template/template.service';

@Component({
  selector: 'jhi-request-slik-detail',
  templateUrl: './request-slik-detail.component.html',
  styleUrls: ['../party-cif/party-cif.style.scss'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class RequestSlikDetailComponent implements OnInit {
  reqSlikStatus = RequestSlikStatus;
  customHeadersJWT;
  paramsIdGet;
  getKey;
  position;
  ngOnInit(): void {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];
    this.getLovPurposeType();
  }

  /**
   * this function only called when the request slik status is draft or return to rm.
   */
  checkDataChecklist;
  getAllChecklistsAndPush() {
    if (this.requestSlik.status === this.reqSlikStatus.DRAFT || this.requestSlik.status === this.reqSlikStatus.RETURN_TO_RM) {
      this.requestSlikChecklistService.getAllChecklistsByRequestSlikId(this.requestSlik.id).subscribe(res => {
        this.checkDataChecklist = res;
        this.checklists = this.checkDataChecklist.length === 0 && this.checkDataChecklist;
      });
    }
  }

  getAllChecklistData(data) {
    data.forEach(element => {
      !this.containsObject(element, this.requestSlikChecklistService.defaultChecklists.getValue()) &&
        this.requestSlikChecklistService.updateDefaultChecklists(element);
    });

    if (this.details.length === 0 && !this.isLoading) {
      this.checklists = this.requestSlikChecklistService.removeDuplicate(this.requestSlikChecklistService.defaultChecklists.getValue());
      const debiturChecklist = {
        idParty: null,
        idRequestSlik: null,
        cust: null,
      };
      debiturChecklist.cust = this.partyCif.customerPerson === null ? this.partyCif.customerOrganization : this.partyCif.customerPerson;

      debiturChecklist.idParty = this.partyCif.partyId;
      debiturChecklist.idRequestSlik = this.requestSlikId;
      this.checklists.push(debiturChecklist);
    } else {
      this.checklists = this.details;
    }
  }

  getFinalOcrData() {
    const splicedData = [];
    this.ocrDatas.forEach(data => {
      if (data.person !== null) {
        splicedData.push(data.person);
      } else if (data.shareHolderOrg !== null) {
        splicedData.push(data.shareHolderOrg);
      } else {
        if (data.customerPerson !== null) {
          splicedData.push(data.customerPerson);
        } else {
          splicedData.push(data.customerOrganization);
        }
      }
    });
    this.ocrDatas = _.uniqBy(splicedData, 'id');

    let finalOcr = [];

    this.ocrDatas.forEach(ocrData => {
      finalOcr = [
        ...finalOcr,
        {
          partyId: ocrData.id,
          requestSlikId: this.requestSlikId.toString(),
          name: ocrData.name !== null ? ocrData.name : ocrData.groupName,
          dob: ocrData.dob && ocrData.dob.slice(0, 10),
          ktp: ocrData.personalIdNumber !== null ? ocrData.personalIdNumber : '',
          npwp: ocrData.taxIdNumber,
          gender: ocrData.gender === null ? '' : ocrData.gender === 'L' ? 'M' : 'F',
          custtype: ocrData.personalIdNumber !== null ? '1' : '2',
          product: 'HR',
          channel: 'LOS',
          purposeCode: this.requestSlik.purposeCode,
        },
      ];
    });

    this.ocrData = finalOcr;
    return finalOcr;
  }

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
    protected lovAndStatus: RequestSlikStatusService,
    protected internalService: InternalService,
    public dialog: MatDialog,
    protected accountService: AccountService,
    protected requestSlikTimelineService: RequestSlikTimelineService,
    protected requestSlikValidateService: RequestSlikValidateService,
    protected partyCifService: PartyCifService,
    protected requestSlikChecklistService: RequestSlikChecklistService,
    protected templateService: TemplateService
  ) {
    // this.requestSlik$ = this.activatedRoute.data;
    this.requestSlikId = Number(this.router.url.split('/')[2]);
    this.requestSlikDetail();
    this.getAccountDetail();
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.position = newPos.positionTypeId;
    });
  }

  segment = 'loading...';

  roles = {
    request: ['RM', 'CRO'],
    approval: ['SME_HEAD', 'DEPT_HEAD', 'HCR1', 'HCR2', 'BUSINESS_SUPPORT'],
  };

  // submitTitle = this.getSubmitTitle()

  getSubmitTitle() {
    return this.requestSlik.status === this.reqSlikStatus.APPROVAL_BU || this.requestSlik.status === this.reqSlikStatus.APPROVAL_SLIK
      ? 'Approve'
      : this.requestSlik.status === this.reqSlikStatus.VERIFY
      ? 'Verify'
      : 'Submit';
  }

  showSubmitButton() {
    if (this.roles.request.includes(this.position)) {
      // RM DLL
      return this.requestSlik.status === this.reqSlikStatus.DRAFT ||
        this.requestSlik.status === this.reqSlikStatus.RETURN_TO_RM ||
        this.requestSlik.status === this.reqSlikStatus.VERIFY
        ? true
        : false;
    } else {
      return this.requestSlik.status === this.reqSlikStatus.APPROVAL_BU || this.requestSlik.status === this.reqSlikStatus.APPROVAL_SLIK
        ? true
        : false;
    }
  }
  showRejectButton() {
    if (this.roles.request.includes(this.position)) {
      // RM DLL
      return false;
    } else {
      return this.requestSlik.status === this.reqSlikStatus.APPROVAL_BU || this.requestSlik.status === this.reqSlikStatus.APPROVAL_SLIK
        ? true
        : false;
    }
  }
  showCancelButton() {
    if (this.roles.request.includes(this.position)) {
      // RM DLL
      return this.requestSlik.status === this.reqSlikStatus.DRAFT || this.requestSlik.status === this.reqSlikStatus.RETURN_TO_RM
        ? true
        : false;
    } else {
      return false;
    }
  }

  showSaveButton() {
    if (this.roles.request.includes(this.position)) {
      // RM DLL
      return this.requestSlik.status === this.reqSlikStatus.DRAFT || this.requestSlik.status === this.reqSlikStatus.RETURN_TO_RM
        ? true
        : false;
    } else {
      return false;
    }
  }

  ocrDatas = [];
  getOcrData(ev) {
    ev.body.map(data => this.ocrDatas.push(data));
  }

  details = [];
  partyCifs;
  requestSlikDetail() {
    this.requestSlikService.getDetail(this.requestSlikId).subscribe({
      next: res => {
        this.details = res.details;
        this.checklists = res.details.map(cheklist => {
          const obj = {
            idParty: cheklist.idParty,
            idRequestSlik: this.requestSlikId,
          };
          return obj;
        });
        this.requestSlik = res.slik;
        this.partyCif = res.partyCif;

        this.loadInternalById(this.partyCif.internalId).then((res2: IInternal) => {
          if (res2.parentId) {
            this.rmBranch = res2;
            this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                  this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                    this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                      this.rmSegment = res6;
                      this.segment = res6.organizationName;
                    });
                  });
                }
              });
            });
          }
        });
      },
      complete: () => {
        this.requestSlikValidateService.setPurposeType(this.requestSlik.purposeCode);
        this.isLoading = false;
        // this.getAllChecklistsAndPush();
      },
    });
  }

  private loadInternalById(internalId: string): Promise<IInternal> {
    return new Promise<IInternal>((resolve, reject) => {
      this.internalService.find(internalId).subscribe(res => {
        if (res.body) {
          resolve(res.body);
        } else {
          resolve(null);
        }
      });
    });
  }

  private loadRegional(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.regionals = res.body;
        resolve();
      });
    });
  }

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        resolve();
      });
    });
  }

  branchs;
  segments;
  regionals;
  rmBranch;
  rmSegment;
  rmRegional;

  private loadInternalInformationRM(): void {
    this.branchs = [];
    this.segments = [];
    this.regionals = [];
    this.loadInternalById('1101').then((res2: IInternal) => {
      if (res2.parentId) {
        this.rmBranch = res2;
        this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
          this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
            if (res4.parentId) {
              this.rmRegional = res4;
              this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                  this.rmSegment = res6;
                });
              });
            }
          });
        });
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  // Get Lov Purpose Type
  purposeType;
  getLovPurposeType() {
    this.lovAndStatus.getLovProposeCode().subscribe(res => {
      this.purposeType = res;
    });
  }

  ocrData = [];
  submit() {
    this.getFinalOcrData();
    this.ocrData = [
      ...this.ocrData,
      {
        partyId: this.partyCif.partyId,
        requestSlikId: this.requestSlikId.toString(),
        name: this.partyCif.customerType === 'CORPORATE' ? this.partyCif.customerOrganization.groupName : this.partyCif.customerPerson.name,
        dob:
          this.partyCif.customerType === 'CORPORATE'
            ? this.partyCif.organizationLegal.deedEstablishDate.slice(0, 10)
            : this.partyCif.customerPerson.dob.slice(0, 10),
        ktp: this.partyCif.customerType === 'CORPORATE' ? '' : this.partyCif.customerPerson.personalIdNumber,
        npwp:
          this.partyCif.customerType === 'CORPORATE'
            ? this.partyCif.customerOrganization.taxIdNumber
            : this.partyCif.customerPerson.taxIdNumber,
        gender: this.partyCif.customerType === 'CORPORATE' ? '' : this.partyCif.customerPerson.gender === 'L' ? 'M' : 'F',
        custtype: this.partyCif.customerType === 'CORPORATE' ? '2' : '1',
        product: 'HR',
        channel: 'LOS',
        purposeCode: this.requestSlik.purposeCode,
      },
    ];

    const data = {
      id: this.requestSlikId,
      status: this.checkStatus(this.requestSlik.status).status,
      checklists: this.checklists,
      partyCif: this.partyCif,
      verifyData: this.verifyChecklistDatas,
      ocr: this.ocrData,
      isSaved: this.isSaved,
      nikNpwp: this.nikNpwp,
    };

    this.requestSlikService.onSubmit(data).subscribe({
      // eslint-disable-next-line object-shorthand
      next: res => {
        data.status === this.reqSlikStatus.CHECKING && this.lovAndStatus.changeReqSlikStatus(this.requestSlikId, data.status).subscribe();
        this.requestSlikTimelineService.postNoteTimeline(this.noteTimeline).subscribe();
        this.router.navigate(['/request-slik']);
      },
      // eslint-disable-next-line object-shorthand
      error: err => {
        if (
          data.status === this.reqSlikStatus.APPROVAL_BU ||
          data.status === this.reqSlikStatus.APPROVAL_SLIK ||
          (data.status === this.reqSlikStatus.CHECKING && err.status === 200) ||
          data.status === this.reqSlikStatus.COMPLETE
        ) {
          data.status === this.reqSlikStatus.CHECKING &&
            err.status === 200 &&
            this.lovAndStatus.changeReqSlikStatus(this.requestSlikId, data.status).subscribe();
          this.requestSlikTimelineService.postNoteTimeline(this.noteTimeline).subscribe();
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
    this.requestSlikValidateService.setPurposeType(ev.value);
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
    this.lovAndStatus.changeReqSlikStatus(this.requestSlikId, 'CANCEL').subscribe(res => {
      this.requestSlikTimelineService.postNoteTimeline(this.noteTimeline).subscribe();
      this.router.navigate(['/request-slik']);
    });
  }

  reject() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.lovAndStatus.changeReqSlikStatus(this.requestSlikId, this.reqSlikStatus.RETURN_TO_RM).subscribe({
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      next: () => {
        this.requestSlikTimelineService.postNoteTimeline(this.noteTimeline).subscribe();
        this.router.navigate(['/request-slik']);
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      // error: err => err.status === 200 && this.router.navigate(['/request-slik']),
      error: err => {
        if (err.status === 200) {
          this.requestSlikTimelineService.postNoteTimeline(this.noteTimeline).subscribe();
          this.router.navigate(['/request-slik']);
        }
      },
    });
  }

  // === Document Editor ===
  onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'request_slik_remarks/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });
  }

  onDocumentChange() {
    this.container.restrictEditing =
      this.requestSlik.status !== this.reqSlikStatus.DRAFT && this.requestSlik.status !== this.reqSlikStatus.RETURN_TO_RM && true;
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

                const contents: string = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }
  // === End Document Editor ===

  protected checkStatus(currentStatus: string) {
    if (
      (currentStatus === this.reqSlikStatus.DRAFT || currentStatus === this.reqSlikStatus.RETURN_TO_RM) &&
      this.segment === 'Small Medium Enterprise'
    ) {
      return {
        status: this.reqSlikStatus.APPROVAL_BU,
      };
    } else if (
      (currentStatus === this.reqSlikStatus.DRAFT || currentStatus === this.reqSlikStatus.RETURN_TO_RM) &&
      this.segment !== 'Small Medium Enterprise'
    ) {
      return {
        status: this.reqSlikStatus.APPROVAL_SLIK,
      };
    } else if (currentStatus === this.reqSlikStatus.APPROVAL_BU) {
      return {
        status: this.reqSlikStatus.APPROVAL_SLIK,
      };
    } else if (currentStatus === this.reqSlikStatus.APPROVAL_SLIK) {
      return {
        status: this.reqSlikStatus.CHECKING,
      };
    } else if (currentStatus === this.reqSlikStatus.VERIFY) {
      return {
        status: this.reqSlikStatus.COMPLETE,
      };
    } else {
      return {
        status: this.reqSlikStatus.COMPLETE,
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
    const partySlik = data.partySlik; // array
    const partyId = data.partyId; // string
    const reqReffId = data.requestReffId; // string

    partySlik.forEach(party => {
      party.partyId = partyId;

      // add attribute key on party
      party.attributes = party.attributes || {};
      party.attributes['partySlikCollaterals'] =
        typeof party.partySlikCollaterals === 'object' ? JSON.stringify(party.partySlikCollaterals) : party.partySlikCollaterals;
      party.attributes['reqReffId'] = JSON.stringify(reqReffId);
      party.attributes['nikNpwp'] = JSON.stringify(data.nikNpwp);

      party.requestReffId = reqReffId;
    });

    return partySlik;
  }

  private mapperIPDFSlikToPartySlik(item: any): any {
    const temp = [];
    item.forEach(element => {
      const partySlik: IPartySlik = new PartySlik();
      partySlik.attributes = element.attributes;
      partySlik.partyId = element.partyId;
      partySlik.bank = element.bank;
      partySlik.limit = element.limit === null ? 0 : Number(element.limit);
      partySlik.rate = element.rate === null ? 0 : parseFloat(element.rate.replace(/,/g, '.'));
      partySlik.tenor = element.tenor == null ? 0 : Number(element.tenor.toString().replace(' bulan', ''));
      partySlik.outstanding = element.outstanding == null ? 0 : Number(element.outstanding.toString().replace(/\./g, ''));
      partySlik.sumCollateralIdrMio =
        element.sumCollateralIdrMio == null ? 0 : Number(element.sumCollateralIdrMio.toString().replace(/\./g, ''));
      partySlik.restructureFrequency = element.frekuensiRestrukturasi == null ? 0 : Number(element.frekuensiRestrukturasi);
      partySlik.arrearsFrequency = element.frekuensiTunggakan == null ? 0 : Number(element.frekuensiTunggakan);
      partySlik.arrearsBase = element.tunggakanPokok == null ? 0 : Number(element.tunggakanPokok);
      partySlik.arrearsInterest = element.tunggakanBunga == null ? 0 : Number(element.tunggakanBunga);
      partySlik.arrearsReason = element.sebabMacet;
      partySlik.lastCollectability = element.kolTerakhir == null ? 0 : Number(element.kolTerakhir.substring(0, 1));
      partySlik.worstCollectability = element.kolTerburuk == null ? 0 : Number(element.kolTerburuk.substring(0, 1));
      partySlik.collateralType = element.collateralType == null ? '' : element.collateralType;
      partySlik.facilityType = element.facilityType;
      partySlik.period = element.period;

      partySlik.restructureType = element.caraRestrukturasi;
      partySlik.description = element.keterangan;
      partySlik.arrearsDate = element.tanggalMacet;
      partySlik.fee = element.denda;
      partySlik.restructureDateThru = element.tanggalRestrukturasiAkhir;
      // ! Penambahan Field Party Slilk disini =====
      partySlik.debtorName = element.debtorName;
      partySlik.bankPelapor = element.bankPelapor;
      partySlik.tanggalAkadAwal = element.tanggalAkadAwal;
      partySlik.tanggalMulai = element.tanggalMulai;
      partySlik.tanggalJatuhTempo = element.tanggalJatuhTempo;
      partySlik.kondisi = element.kondisi;
      partySlik.totalAgunan = element.totalAgunan;
      partySlik.sumCollateralIdrMio = element.sumCollateralIdrMio;
      partySlik.typeOfFacility = element.typeOfFacility;
      partySlik.plafond = element.plafond;
      temp.push(partySlik);
    });

    return temp;
  }

  nikNpwp;
  tempData = [];
  protected getSelectedVerifyData(ev) {
    this.tempData = [];
    this.nikNpwp = ev.nikNpwp;

    // const partySlik = ev.partySlik;

    const partySlikWithPartyId = this.makePartySlikWithPartyId(ev);

    partySlikWithPartyId.forEach(element => {
      // Check if element exist in verifyData, if exist then dont push to tempData
      const isExist = _.find(this.verifyData, function (val) {
        return _.isEqual(element.partyId, val.partyId);
      });

      if (!_.isObject(isExist)) {
        this.tempData.push(element);
      } else {
        // remove element from verifyData with same partyId on element
        this.verifyData = this.verifyData.filter(verifyObj => verifyObj.partyId !== element.partyId);

        // push element to tempData
        this.tempData.push(element);
      }
    });

    this.tempData.forEach(el => {
      this.verifyData.push(el);
    });

    this.verifyData = this.mapperIPDFSlikToPartySlik(this.verifyData);
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
      cust: null,
    };
    // Add additional data for ocrData
    // data.cust = ev.customerPerson === null ? ev.customerOrganization : ev.customerPerson;
    data.cust = this.partyCif.customerPerson === null ? this.partyCif.customerOrganization : this.partyCif.customerPerson;

    data.idParty = this.partyCif.partyId;
    data.idRequestSlik = this.requestSlikId;
    if (check.checked) {
      // ketika cek
      this.requestSlikChecklistService.updateChecklistOcrs(data);

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

  userName: string;
  createdBy: string;
  getAccountDetail() {
    this.accountService.identity().subscribe(res => {
      this.createdBy = res.login;
      this.userName = res.firstName + ' ' + res.lastName;
    });
  }

  noteTimeline: IRequestSlikNote;
  public openSubmitDialog(task): void {
    if (
      !this.requestSlikValidateService.validate() &&
      (this.requestSlik.status === this.reqSlikStatus.DRAFT || this.requestSlik.status === this.reqSlikStatus.RETURN_TO_RM) &&
      task !== 'cancel'
    ) {
      return this.requestSlikValidateService.messages.getValue().forEach(message => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
      });
    }
    const dialogRef = this.dialog.open(RequestSlikPopupComponent, {
      width: '80vw',
      data: {
        status: this.checkStatus(this.requestSlik.status),
        refKeyId: this.requestSlikId,
        note: '',
        userName: this.userName,
        createdBy: this.createdBy,
        businessKey: 'SLIK',
        task,
      },
    });
    dialogRef.afterClosed().subscribe(_res => {
      if (_res) {
        this.noteTimeline = _res;
        if (task === 'cancel') {
          this.cancel();
        } else if (task === 'reject') {
          this.reject();
        } else {
          this.submit();
        }
      }
    });
  }
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.previousState();
      }
    });
  }

  verifyChecklistDatas;
  getAllChecklistVerifyData(el) {
    this.tempData = [];
    this.nikNpwp = el.content.nikNpwp;

    // if el.mode !== 'add' then remove data from verifyData with same id on el.content.id
    if (el.mode !== 'add') {
      // filter verifyData, and remove inside verifyData with same el.content
      this.verifyData = this.verifyData.filter(verifyObj => _.isEqual(verifyObj, el.content) === false);
    } else {
      this.verifyData.push(el.content);
    }

    // makePartySlikWithPartyId on each element of verifyData
    this.verifyData.forEach(element => {
      this.tempData.push(this.makePartySlikWithPartyId(element));
    });

    const removedDuplicateData = [];
    // map tempData
    this.tempData.forEach(temp => {
      // forEach temp and remove duplicate data
      temp.forEach(tempObj => removedDuplicateData.push(tempObj));
    });

    // remove duplicate data from removedDuplicateData
    this.tempData = _.uniqWith(removedDuplicateData, _.isEqual);

    let finalTempData = this.mapperIPDFSlikToPartySlik(this.tempData);

    // Take out all array inside finalTempData, and merge it into one array
    finalTempData = _.flattenDeep(finalTempData);

    this.verifyChecklistDatas = finalTempData;
  }
}
