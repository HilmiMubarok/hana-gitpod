import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IRequestSlik, requestSlikData } from './request-slik.model';
import { finalize, map, Observable } from 'rxjs';
import { IPartyCif } from '../party-cif/party-cif.model';
import { PARTY_CIF_EXAMPLE } from './party-cif-dummy';
import { DocumentEditorContainerComponent, DocumentEditorKeyDownEventArgs } from '@syncfusion/ej2-angular-documenteditor';
import { RequestSlikService } from './request-slik.service';
import * as _ from 'lodash';

@Component({
  selector: 'jhi-request-slik-detail',
  templateUrl: './request-slik-detail.component.html',
})
export class RequestSlikDetailComponent {
  // requestSlik$: Observable<IRequestSlik> | null = null;
  requestSlik: IRequestSlik | null = null;
  partyCif;
  isLoading: Boolean = true;
  checklists = [];

  // Checklist
  saveDetails(data: object[]) {
    this.requestSlikService.saveDetails(data).subscribe(res => console.log(res));
  }

  protected containsObject(obj, list) {
    const res = _.find(list, function (val) {
      return _.isEqual(obj, val);
    });
    return _.isObject(res) ? true : false;
  }

  getChecklistManagementData(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }

    console.log(this.checklists);
  }

  getChecklistShareholder(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }

    console.log(this.checklists);
  }

  getChecklistOther(ev) {
    if (ev.mode === 'add') {
      !this.containsObject(ev.data, this.checklists) && this.checklists.push(ev.data);
    } else {
      this.containsObject(ev.data, this.checklists) && _.remove(this.checklists, { idParty: ev.data.idParty });
    }

    console.log(this.checklists);
  }

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
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

  requestSlikId: number;
  constructor(protected activatedRoute: ActivatedRoute, private router: Router, private requestSlikService: RequestSlikService) {
    // this.requestSlik$ = this.activatedRoute.data;
    // this.requestSlik = requestSlikData.filter(res => res.id === Number(this.router.url.split('/')[2]))[0];
    this.requestSlikId = Number(this.router.url.split('/')[2]);
    // this.partyCif = PARTY_CIF_EXAMPLE;
    this.requestSlikDetail();
  }

  requestSlikDetail() {
    this.requestSlikService.getDetail(this.requestSlikId).subscribe({
      next: res => {
        console.log({
          requestSLik: res.slik,
          partyCif: res.partyCif.customer,
        });
        this.requestSlik = res.slik;
        this.partyCif = res.partyCif.customer;
      },
      complete: () => (this.isLoading = false),
    });
  }

  checkStatus(currentStatus: string) {
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

  submit() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.requestSlikService
      .onSubmit(this.requestSlikId, this.checkStatus(this.requestSlik.status))
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .subscribe(() => this.router.navigate(['request-slik']));
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

  previousState(): void {
    window.history.back();
  }

  save() {
    this.saveDetails(this.checklists);
    // console.log(this.checklists);
  }
}
