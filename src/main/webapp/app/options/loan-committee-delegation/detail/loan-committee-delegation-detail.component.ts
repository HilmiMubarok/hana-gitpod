import { Component } from '@angular/core';
import { LoanCommitteeDelegationService } from '../loan-committee-delegation.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-loan-committee-delegation-detail',
  templateUrl: './loan-committee-delegation-detail.component.html',
  styleUrls: ['../../correction-application/correction-application.scss'],
})
export class LoanCommitteeDelegationDetailComponent {
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoading.asObservable();
  public idApplication: number;
  public applicationNumber: string;
  public customerNumber: string;
  public customerName: string;
  public status: string;
  public people: MatTableDataSource<any>;
  public displayedColumns: string[] = ['no', 'internal', 'name', 'position'];
  public creditProposal: ICreditProposal;

  constructor(private service: LoanCommitteeDelegationService, private route: ActivatedRoute, private message: MessageService) {
    // get id in route
    this.route.params.subscribe(params => {
      if (params.id) {
        this.isLoading.next(true);

        this.service.getLoanCommitteeDelegationById(params.id).subscribe(res => {
          this.creditProposal = res.body;

          this.idApplication = res.body.id;
          this.applicationNumber = res.body.applicationNumber;
          this.customerNumber = res.body.customerNumber;
          this.customerName = res.body.prospectPerson ? res.body.prospectPerson.name : res.body.prospectOrganization.groupName;
          this.status = res.body.statusDescription;

          this.loadPeople();
        });
      }
    });

    this.people = new MatTableDataSource<any>();
  }

  loadPeople(): void {
    this.service.getLoanCommitteeDelegationDetail(this.idApplication).subscribe(res => {
      this.people.data = res.body;
      this.isLoading.next(false);
    });
  }

  save(): void {
    const data = this.people.data.map(p => ({
      application_id: this.idApplication,
      type: 'loan_committee',
      position_Id: p.positionToId,
    }));

    this.service
      .saveLoanCommitteeDelegation(data)
      .subscribe(res => this.message.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully' }));
  }
}
