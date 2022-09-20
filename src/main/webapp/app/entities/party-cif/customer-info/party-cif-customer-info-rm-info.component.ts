import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IPerson } from 'app/entities/person/person.model';
import { IPosition, Position } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-party-cif-customer-info-rm-info',
  templateUrl: './party-cif-customer-info-rm-info.component.html',
})
export class PartyCifCustomerInfoRMInfoComponent extends AbstractEntityViewPageComponent<IPerson> {
  public segments: IInternal[];
  public regionals: IInternal[];
  public branchs: IInternal[];

  private _person: IPerson;

  @Input()
  get person() {
    return this._person;
  }

  set person(data: IPerson) {
    this._person = data;
  }

  public rmSegment: IInternal;
  public rmRegional: IInternal;
  public rmBranch: IInternal;
  public rmPosition: IPosition;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private internalService: InternalService,
    private positionService: PositionService
  ) {
    super();
    this.rmPosition = new Position();
    this.rmBranch = new Internal();
    this.rmRegional = new Internal();
    this.rmSegment = new Internal();
  }

  protected initialOnChange(changes: SimpleChanges): void {
    if (changes['person']) {
      if (this.person) {
        this.loadInternalInformationRM(this.person.id);
      }
    }
  }

  private findPositionByIdParty(partyId: string): Promise<IPosition> {
    return new Promise<IPosition>((resolve, reject) => {
      if (this.person.id) {
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
          }
        });
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

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        resolve();
      });
    });
  }
}
