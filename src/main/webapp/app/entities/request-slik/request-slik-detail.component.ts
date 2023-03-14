import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IRequestSlik, requestSlikData } from './request-slik.model';
import { Observable } from 'rxjs';
import { IPartyCif } from '../party-cif/party-cif.model';
import { PARTY_CIF_EXAMPLE } from './party-cif-dummy';
import { DocumentEditorContainerComponent, DocumentEditorKeyDownEventArgs } from '@syncfusion/ej2-angular-documenteditor';

@Component({
  selector: 'jhi-request-slik-detail',
  templateUrl: './request-slik-detail.component.html',
})
export class RequestSlikDetailComponent {
  // requestSlik$: Observable<IRequestSlik> | null = null;
  requestSlik: IRequestSlik | null = null;
  partyCif;

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

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {
    // this.requestSlik$ = this.activatedRoute.data;
    this.requestSlik = requestSlikData.filter(res => res.id === Number(this.router.url.split('/')[2]))[0];
    this.partyCif = PARTY_CIF_EXAMPLE;
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
}
