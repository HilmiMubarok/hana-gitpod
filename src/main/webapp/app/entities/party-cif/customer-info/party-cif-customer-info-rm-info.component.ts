import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IPerson } from 'app/entities/person/person.model';
import { IPosition, Position } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { APPLICATION_TYPE, POSITION_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-customer-info-rm-info',
  templateUrl: './party-cif-customer-info-rm-info.component.html',
})
export class PartyCifCustomerInfoRMInfoComponent implements OnInit {
  public segments: IInternal[];
  public regionals: IInternal[];
  public branchs: IInternal[];
  public internals: IInternal[];
  public positionRM: IPosition[];
  public positionRMS: IPosition;
  public rmSegment: IInternal;
  public rmRegional: IInternal;
  public rmBranch: IInternal;
  public rmPosition: IPosition;
  public positionRms1 = 0;

  // private _person: IPerson;
  private _partyCif: IPartyCif;

  // @Input()
  // get person() {
  //   return this._person;
  // }

  // set person(data: IPerson) {
  //   this._person = data;
  // }

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(data: IPartyCif) {
    this._partyCif = data;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    private internalService: InternalService,
    private positionService: PositionService
  ) {
    this.rmPosition = new Position();
    this.positionRMS = new Position();
    this.rmBranch = new Internal();
    this.rmRegional = new Internal();
    this.rmSegment = new Internal();
  }
  ngOnInit(): void {
    this.loadPositionRM();
    
  }

  // protected initialOnChange(changes: SimpleChanges): void {
  //   if (changes['partyCif']) {
  //     if (this.partyCif) {
  //       this.loadInternalInformationRM(this.partyCif.rm.id);

  //     }
  //     console.log('rm name',   this.partyCif.rm.name);

  //   }
  // }

  private loadPositionRM(): void {
    const tempName = this.partyCif.rm.firstName;
    this.positionService.queryFilterBy({ idPositionType: POSITION_TYPE.RM, size: 9999, page: 0 }).subscribe(res => {
      this.positionRM = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      this.positionRMS = lodash.find(res.body, function (o) {
        return o.employeeFirstName === tempName;
      });

      if (this.positionRMS?.partyId !== undefined || this.positionRMS?.partyId !== null) {
        this.positionRms1 = this.positionRMS?.id;
        this.loadInternalInformationRM(this.positionRMS?.partyId);
      }
      
    });
  }

  private findPositionByIdParty(partyId: string): Promise<IPosition> {
    return new Promise<IPosition>((resolve, reject) => {
      if (this.partyCif.id) {
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

  // private loadInternalInformationRM(partyId: string): void {
  //   this.branchs = [];
  //   this.segments = [];
  //   this.regionals = [];
  //   this.findPositionByIdParty(partyId).then((res: IPosition) => {
  //     if (res) {
  //       this.loadInternalById(res.internalId).then((res2: IInternal) => {
  //         if (res2.parentId) {
  //           this.rmBranch = res2;
  //           this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
  //             this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
  //               if (res4.parentId) {
  //                 this.rmRegional = res4;
  //                 this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
  //                   this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
  //                     this.rmSegment = res6;
  //                     this.loadSegment();
  //                   });
  //                 });
  //               }
  //             });
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  private loadInternalInformationRM(partyId: string): void {
    this.branchs = [];
    this.segments = [];
    this.regionals = [];
    this.findPositionByIdParty(partyId).then((res: IPosition) => {
      if (res) {
        this.loadInternalById(res.internalId).then((res2: IInternal) => {
          if (res2.parentId) {
            this.rmBranch = res2;
            this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                  this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                    this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                      this.rmSegment = res6;
                      this.loadSegment();
                    });
                  });
                }
              });
            });
          } else {
            if (!res2.parentId) {

              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                  this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                    this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                      this.rmSegment = res6;
                      this.loadSegment();
                    });
                  });
                }
                
              });
            }
          }
          
        });
      } else {
        if (!res) {
          this.branchs = [];
          this.segments = [];
          this.regionals = [];
          
        }
      }
    });
  }

  private loadSegment(): void {
    this.internalService.queryFilterBy({ idInternalType: APPLICATION_TYPE.BUSINESS_UNIT, size: 9999, page: 0 }).subscribe(res => {
      this.segments = res.body;
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
  public selectRM(event: any): void {
    const value: string = event['value'];
    if (value) {
      const position: IPosition = lodash.find(this.positionRM, function (o) {
        return o.id === parseInt(value, 10);
      });
      this.partyCif.rm.id = position.partyId;
      this.loadInternalInformationRM(position.partyId);
    } else {
      this.partyCif.rm.id = null;
    }
  }

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        resolve();
      });
    });
  }
}
