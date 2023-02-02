import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IPosition, Position } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { ICreditProposal } from '../credit-proposal.model';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-booking-branch',
  templateUrl: './credit-proposal-booking-branch.component.html',
  styleUrls: ['./booking-branch.css'],
})
export class CreditProposalBookingBranchComponent implements OnChanges {
  private _creditProposal: ICreditProposal;
  public rmPosition: IPosition;
  public rmBranch: IInternal;
  public rmRegional: IInternal;
  public penampung: string;

  @Input() isViewLoan: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor(
    private internalService: InternalService,
    private positionService: PositionService
  ) {
	this.rmPosition = new Position();
	this.rmBranch = new Internal();
    this.rmRegional = new Internal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
	  if (this.creditProposal.internalId) {
		this.loadInternalInformationRMByInternalId(this.creditProposal.internalId);
	  } else {
		this.loadInternalInformationRM(this.creditProposal.cif.rm.id);
	  }
    }
  }
  
  private loadInternalInformationRMByInternalId(internalId: string): void {
    this.branchs = [];
	this.loadInternalById(internalId).then((res2: IInternal) => {
	  if (res2.parentId) {
		this.rmBranch = res2;
		this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
		  this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
			if (res4.parentId) {
			  this.rmRegional = res4;
			}
		  });
		});
	  }
	});
  }

  private loadInternalInformationRM(partyId: string): void {
    this.branchs = [];
    this.findPositionByIdParty(partyId).then((res: IPosition) => {
      if (res) {
        this.loadInternalById(res.internalId).then((res2: IInternal) => {
          if (res2.parentId) {
            this.rmBranch = res2;
            this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                }
              });
            });
          }
        });
      }
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

  private findPositionByIdParty(partyId: string): Promise<IPosition> {
    return new Promise<IPosition>((resolve, reject) => {
      if (this.creditProposal.cif.rm.id) {
        this.positionService.queryFilterBy({ idParty: partyId, size: 1, page: 0 }).subscribe(res => {
          if (res.body.length > 0) {
            this.rmPosition = res.body[0];
            resolve(this.rmPosition);
          } else {
            resolve(null);
          }
        });
      }
    });
  }

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        if (this.creditProposal.internalId !== null || this.creditProposal.internalId !== undefined) {
          for (let i = 0; i < res.body.length; i++) {
            if ((this.creditProposal.internalId = this.branchs[i].id.toString())) {
              this.penampung = this.branchs[i].name;
            }
          }
        } else {
          for (let i = 0; i < res.body.length; i++) {
            if (this.creditProposal.debtorData.bookingBranch === this.branchs[i].id.toString()) {
              this.penampung = this.branchs[i].organizationName;
            }
          }
        }

        resolve();
      });
    });
  }

  public select(event): void {
    for (let i = 0; i < this.branchs.length; i++) {
      if (event.value === this.branchs[i].id) {
        this.creditProposal.internalId = this.branchs[i].id.toString();
        this.creditProposal.internalName = this.branchs[i].name;
      }
    }
  }
}
