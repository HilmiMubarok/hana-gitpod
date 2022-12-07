import { Component, ViewChild, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-loan-facility-approve-level',
  templateUrl: './approve-level.component.html',
  styleUrls: ['./approve-level.css'],
})
export class LoanFacilityAproveLevelComponent {
  public displayColumns: string[] = ['no', 'approval_name', 'position', 'date', 'available_status', 'recomendation', 'action'];
  public loading: boolean;

  constructor() {
    this.loading = false;
  }

  singleCheck(checkNode: any) {
    if (checkNode.target.classList.contains('checked')) {
      checkNode.target.classList.remove('checked');
    } else {
      checkNode.target.classList.add('checked');
    }
  }
}
