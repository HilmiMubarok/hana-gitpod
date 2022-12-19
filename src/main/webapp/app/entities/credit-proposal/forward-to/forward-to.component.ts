import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationRole, IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { POSITION_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-forward-to',
  templateUrl: './forward-to.component.html',
})
export class ForwardToComponent implements OnChanges {
  public applicationRoleId;
  public applicationRole: IApplicationRole;
  public applicationRoles: IApplicationRole[];
  public position: IPosition[];
  public _creditProposal: ICreditProposal = new CreditProposal();
  public clickedMenu: string;
  public parentPath = this.router.url.split('/')[1];

  hide: boolean;
  constructor(
    private positionService: PositionService,
    public applicationRoleService: ApplicationRoleService,
    private router: Router,
    protected activatedRoute: ActivatedRoute
  ) {
    this.applicationRole = new ApplicationRole();
    this.hiddenField();
  }

  // send applicationRole data to parent

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      if (this.creditProposal.statusId === 'CP_APPROVAL_SME_HEAD') {
        this.loadPosition(POSITION_TYPE.BM);
      } else if (this.creditProposal.statusId === 'CP_APPROVAL_BM') {
        this.loadPosition(POSITION_TYPE.SDH);
      } else if (this.creditProposal.statusId === 'CP_APPROVAL_SDH') {
        this.loadPosition(POSITION_TYPE.DH);
      } else if (this.creditProposal.statusId === 'CP_APPROVAL_DH') {
        this.loadPosition(POSITION_TYPE.DEPT_HEAD);
      }
    }
  }

  @Output() forwardTo = new EventEmitter();

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: any) {
    this._creditProposal = item;
  }

  public loadPosition(position): void {
    this.positionService.queryFilterBy({ idPositionType: position, size: 9999, page: 0 }).subscribe(res => {
      if (position === POSITION_TYPE.BM) {
        this.position = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === POSITION_TYPE.SDH) {
        this.position = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === POSITION_TYPE.DH) {
        this.position = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === POSITION_TYPE.DEPT_HEAD) {
        this.position = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      }
    });

    this.applicationRoleService
      .queryFilterBy({ idApplication: this.creditProposal.id, size: 9999, page: 0 })
      .subscribe(resApplicationRole => {
        if (resApplicationRole) {
          this.applicationRoles = resApplicationRole.body;
          for (let i = 0; i < this.applicationRoles.length; i++) {
            if (this.applicationRoles[i].roleId === POSITION_TYPE.BM) {
              for (let j = 0; j < this.position.length; j++) {
                if (this.applicationRoles[i].partyId === this.position[j].partyId) {
                  this.applicationRoleId = this.position[j].id;
                  this.applicationRole = this.applicationRoles[i];
                }
              }
            }
            if (this.applicationRoles[i].roleId === POSITION_TYPE.SDH) {
              for (let j = 0; j < this.position.length; j++) {
                if (this.applicationRoles[i].partyId === this.position[j].partyId) {
                  this.applicationRoleId = this.position[j].id;
                  this.applicationRole = this.applicationRoles[i];
                }
              }
            }
            if (this.applicationRoles[i].roleId === POSITION_TYPE.DH) {
              for (let j = 0; j < this.position.length; j++) {
                if (this.applicationRoles[i].partyId === this.position[j].partyId) {
                  this.applicationRoleId = this.position[j].id;
                  this.applicationRole = this.applicationRoles[i];
                }
              }
            }

            if (this.applicationRoles[i].roleId === POSITION_TYPE.DEPT_HEAD) {
              for (let j = 0; j < this.position.length; j++) {
                if (this.applicationRoles[i].partyId === this.position[j].partyId) {
                  this.applicationRoleId = this.position[j].id;
                  this.applicationRole = this.applicationRoles[i];
                }
              }
            }
          }
        }
      });
  }

  public onSelectForwardTo(event: any): void {
    for (let i = 0; i < this.position.length; i++) {
      if (event.value === this.position[i].id) {
        for (let j = 0; j < this.applicationRoles.length; j++) {
          if (this.applicationRoles[j].partyId === this.position[i].partyId) {
            this.applicationRole.id = this.applicationRoles[j].id;
          }
        }

        this.applicationRole.partyId = this.position[i].partyId;
        this.applicationRole.partyName = this.position[i].employeeFirstName;
        this.applicationRole.roleId = this.position[i].positionTypeId;
        this.applicationRole.roleDescription = this.position[i].positionTypeDescription;
        this.applicationRole.applicationId = this.creditProposal.id;
      }
      this.forwardTo.emit(this.applicationRole);
    }

    console.log('INI APPS ROLE', this.applicationRole);
  }

  public hiddenField() {
    if (this.parentPath === 'cp-status-approval') {
      this.hide = true;
    }
  }
}
