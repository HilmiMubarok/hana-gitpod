import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IRequestSlik, requestSlikData } from './request-slik.model';
import { Observable } from 'rxjs';
import { IPartyCif } from '../party-cif/party-cif.model';
import { PARTY_CIF_EXAMPLE } from './party-cif-dummy';

@Component({
  selector: 'jhi-request-slik-detail',
  templateUrl: './request-slik-detail.component.html',
})
export class RequestSlikDetailComponent {
  // requestSlik$: Observable<IRequestSlik> | null = null;
  requestSlik: IRequestSlik | null = null;
  partyCif;

  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
  };

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
