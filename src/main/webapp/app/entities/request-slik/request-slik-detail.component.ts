import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IRequestSlik } from './request-slik.model';
import { DocumentEditorContainerComponent, DocumentEditorKeyDownEventArgs } from '@syncfusion/ej2-angular-documenteditor';
import { RequestSlikService } from './request-slik.service';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { PartySlikService } from '../party-slik/party-slik.service';
import { IPDFSlik } from 'app/shared/ocr/pdf-slik.model';
import { IPartySlik, PartySlik } from '../party-slik/party-slik.model';

@Component({
  selector: 'jhi-request-slik-detail',
  templateUrl: './request-slik-detail.component.html',
})
export class RequestSlikDetailComponent {
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

  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private requestSlikService: RequestSlikService,
    protected messageService: MessageService,
    protected partySlikService: PartySlikService
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
        // console.log({
        //   res,
        //   requestSLik: res.slik,
        //   partyCif: res.partyCif.customer,
        // });
        this.checklists = res.details;
        this.requestSlik = res.slik;
        this.partyCif = res.partyCif.customer;

        // ! Tidak butuh ini harusnya
        // this.requestSlik.status === 'Verify' &&
        //   this.requestSlikService.getCbasResult(this.requestSlikId, this.partyCif.partyId).subscribe(resss => {
        //     this.result = this.requestSlikService.parseSlikResult(resss);
        //   });
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

  hitPartySlik() {
    this.partySlikService.saveAll(this.verifyData).subscribe(res => {
      console.log(res);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save Success' });
    });
  }

  submit() {
    // this.requestSlikService.onSubmit(this.requestSlikId, this.checkStatus(this.requestSlik.status));
    const data = {
      id: this.requestSlikId,
      status: this.checkStatus(this.requestSlik.status).status,
      checklists: this.checklists,
      partyId: this.partyCif.partyId,
      verifyData: this.verifyData,
    };
    this.requestSlikService.onSubmit(data).subscribe({
      next: res => {
        res[1].status === 200 && this.router.navigate(['/request-slik']);
      },
      error: err => {
        err.status === 200 && this.router.navigate(['/request-slik']);
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      complete: () => this.router.navigate(['/request-slik']),
    });
    // this.requestSlikService.onSubmit(this.requestSlikId, this.checkStatus(this.requestSlik.status)).subscribe({
    //   next: res => {
    //     res.status === 200 && this.router.navigate(['/request-slik']);
    //   },
    //   error: err => {
    //     err.status === 200 && this.router.navigate(['/request-slik']);
    //   },
    //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
    //   complete: () => this.router.navigate(['/request-slik']),
    // });
  }

  save() {
    // this.saveDetails(this.checklists);
    this.requestSlikService.saveDetails(this.checklists).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save Success' });
    });
    // console.log(this.checklists);
  }

  // === Document Editor ===
  onCreate(): void {
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
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
  // === End Document Editor ===

  protected checkStatus(currentStatus: string) {
    if (currentStatus === 'Draft') {
      return {
        status: 'ApprovalSlik',
      };
    } else if (currentStatus === 'ApprovalSlik') {
      return {
        status: 'Checking',
      };
    } else if (currentStatus === 'Checking') {
      return {
        status: 'Verify',
      };
    } else {
      return {
        status: 'Complete',
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
    // obj = ev,
    // listVerifyData = this.verifyData

    // check duplicate obj based on partyId
    const res = _.find(listVerifyData, function (val) {
      return _.isEqual(obj.partyId, val.partyId);
    });

    return _.isObject(res) ? true : false;
  }

  protected makePartySlikWithPartyId(data) {
    const partySlik = data.partySlik;
    const partyId = data.partyId;

    // add partyId to partySlik
    partySlik.partyId = partyId;

    return partySlik;
  }

  private mapperIPDFSlikToPartySlik(item: any): IPartySlik {
    const partySlik: IPartySlik = new PartySlik();
    partySlik.attributes = {
      partySlikCollaterals: item.partySlikCollaterals,
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

    console.log('VERIFY DATA', this.verifyData);
  }

  protected getChecklistManagementData(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }

    // console.log(this.checklists);
  }

  protected getChecklistShareholder(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }

    // console.log(this.checklists);
  }

  protected getChecklistOther(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }

    // console.log(this.checklists);
  }
}
