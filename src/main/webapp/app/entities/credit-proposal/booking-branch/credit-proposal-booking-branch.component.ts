import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IPosition, Position } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { APPLICATION_TYPE, POSITION_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../credit-proposal.model';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-booking-branch',
  templateUrl: './credit-proposal-booking-branch.component.html',
  styleUrls: ['./booking-branch.css'],
})
export class CreditProposalBookingBranchComponent implements OnChanges {
  public internals: IInternal[];
  public segments: IInternal[];
  public regionals: IInternal[];
  public branchs: IInternal[];
  public positionRM: IPosition[];
  public rmSegment: IInternal;
  public rmRegional: IInternal;
  public rmBranch: IInternal;
  public rmPosition: IPosition;

  public internalId: any;
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor(private internalService: InternalService, private positionService: PositionService) {
    this.internals = [];
    this.rmRegional = new Internal();
    this.rmPosition = new Position();
    this.rmBranch = new Internal();
    this.rmSegment = new Internal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      if (this.creditProposal.rm.partyId) {
        this.loadInternalInformationRM(this.creditProposal.rm.partyId);
      }
    }
  }

  private loadInternalInformationRM(partyId: string): void {
    this.branchs = [];
    this.segments = [];
    this.regionals = [];
    this.findPositionByIdParty(partyId).then((res: IPosition) => {
      if (res) {
        this.loadInternalById(res.internalId).then((res2: IInternal) => {
          if (res2.parentId) {
            this.rmBranch = res2;
            console.log('ini regional', this.rmBranch.name);

            // this.creditProposal.internalId = this.rmBranch.parentId.toString();

            this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                  console.log('ini regional', this.rmRegional);

                  //   this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                  //     this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                  //       this.rmSegment = res6;
                  //       this.loadSegment();
                  //     });
                  //   });
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
      if (this.creditProposal.rm.partyId) {
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

  //   public selectRM(event: any): void {
  //     const value: string = event['value'];
  //     if (value) {
  //       const position: IPosition = lodash.find(this.positionRM, function (o) {
  //         return o.id === parseInt(value, 10);
  //       });
  //       this.creditProposal.rm.partyId = position.partyId;
  //       this.loadInternalInformationRM(position.partyId);
  //     } else {
  //       this.creditProposal.rm.partyId = null;
  //     }
  //   }

  //   private loadPositionRM(): void {
  //     this.positionService.queryFilterBy({ idPositionType: POSITION_TYPE.RM, size: 9999, page: 0 }).subscribe(res => {
  //       this.positionRM = lodash.filter(res.body, function (o) {
  //         return o.partyId !== null;
  //       });
  //     });
  //   }

  //   private loadSegment(): void {
  //     this.internalService.queryFilterBy({ idInternalType: APPLICATION_TYPE.BUSINESS_UNIT, size: 9999, page: 0 }).subscribe(res => {
  //       this.segments = res.body;
  //     });
  //   }

  //   private loadRegional(value: string): Promise<void> {
  //     return new Promise<void>((resolve, reject) => {
  //       this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
  //         this.regionals = res.body;
  //         resolve();
  //       });
  //     });
  //   }

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        //   this.internalId= this.creditProposal.internalId
        //   for (let i = 0; i < this.branchs.length; i++) {
        //    this.creditProposal.internalId = this.branchs[i].id.toString()

        //   }
        // console.log("cek",this.branchs );

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
      console.log('internal id', this.creditProposal.internalId);
    }
  }
}
