import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationRole, IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import lodash from 'lodash';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-forward-to',
  templateUrl: './forward-to.component.html',
})
export class ForwardToComponent implements OnChanges {
  constructor(private positionService: PositionService, public applicationRoleService: ApplicationRoleService, private router: Router) {
    this.applicationRole = new ApplicationRole();
  }
  public applicationRoleId;
  public applicationRole: IApplicationRole;
  public applicationRoles: IApplicationRole[];
  public position: IPosition[];
  public _creditProposal: ICreditProposal = new CreditProposal();

  // send applicationRole data to parent

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      if (this.creditProposal.statusId === 'CP_APPROVAL_SME_HEAD') {
        this.loadPosition('BM');
        console.log('ini approve BM', this.loadPosition('BM'));
      } else if (this.creditProposal.statusId === 'CP_APPROVAL_BM') {
        this.loadPosition('SDH');
        console.log('ini approve SDH', this.loadPosition('SDH'));
      } else if (this.creditProposal.statusId === 'CP_APPROVAL_SDH') {
        this.loadPosition('DH');
        console.log('ini approve DH', this.loadPosition('DH'));
      } else if (this.creditProposal.statusId === 'CP_APPROVAL_DH') {
        this.loadPosition('DEPT_HEAD');
        console.log('ini approve DEPT_HEAD', this.loadPosition('DEPT_HEAD'));
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
      if (position === 'BM') {
        this.position = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === 'SDH') {
        this.position = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === 'DH') {
        this.position = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === 'DEPT_HEAD') {
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
            if (this.applicationRoles[i].roleId === 'BM') {
              for (let j = 0; j < this.position.length; j++) {
                if (this.applicationRoles[i].partyId === this.position[j].partyId) {
                  this.applicationRoleId = this.position[j].id;
                  this.applicationRole = this.applicationRoles[i];
                }
              }
            }
            if (this.applicationRoles[i].roleId === 'SDH') {
              for (let j = 0; j < this.position.length; j++) {
                if (this.applicationRoles[i].partyId === this.position[j].partyId) {
                  this.applicationRoleId = this.position[j].id;
                  this.applicationRole = this.applicationRoles[i];
                }
              }
            }
            if (this.applicationRoles[i].roleId === 'DH') {
              for (let j = 0; j < this.position.length; j++) {
                if (this.applicationRoles[i].partyId === this.position[j].partyId) {
                  this.applicationRoleId = this.position[j].id;
                  this.applicationRole = this.applicationRoles[i];
                }
              }
            }

            if (this.applicationRoles[i].roleId === 'DEPT_HEAD') {
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
}
