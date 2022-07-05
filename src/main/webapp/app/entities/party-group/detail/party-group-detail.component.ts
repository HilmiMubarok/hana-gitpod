import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyGroup } from '../party-group.model';

@Component({
  selector: 'jhi-party-group-detail',
  templateUrl: './party-group-detail.component.html',
})
export class PartyGroupDetailComponent implements OnInit {
  partyGroup: IPartyGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyGroup }) => {
      this.partyGroup = partyGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
