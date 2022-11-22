import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationRole, IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import _ from 'lodash';
import lodash from 'lodash';
import { CreditProposal, ICreditProposal } from '../../credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-assign-to',
  templateUrl: './assign-to.component.html',
})
export class AssignToComponent implements OnInit {
  constructor(private positionService: PositionService, public applicationRoleService: ApplicationRoleService) {
    this.applicationRole = new ApplicationRole();
  }

  public applicationRoles: IApplicationRole[];
  public applicationRoleId;
  public applicationRole;
  public position: IPosition[];
  public _creditProposal: ICreditProposal = new CreditProposal();

  ngOnInit(): void {
    if (this.url === 'la-distribution') {
      this.loadPosition(['CRO']);
    } else if (this.url === 'cc-distribution') {
      this.loadPosition(['CC_ANALYST', 'COMPLIANCE_OFCR']);
    } else if (this.url === 'distribution') {
      this.loadPosition(['SMELEGALOFRAM', 'OUTLEGALOFRAM', 'OUTLEGALOFRM', 'COMLEGALOFRAM', 'COMLEGALOFRM', 'LEGAL_OFFICER']);
    }
  }

  @Input() url: string;

  @Output() assignTo = new EventEmitter();

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: any) {
    this._creditProposal = item;
  }

  public loadPosition(position: any): void {
    this.positionService.queryFilterByNew({ idPositionTypes: position, size: 9999, page: 0 }).subscribe(res => {
      this.position = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      this.applicationRoleService
        .queryFilterBy({ idApplication: this.creditProposal.id, size: 9999, page: 0 })
        .subscribe(resApplicationRole => {
          if (resApplicationRole) {
            this.applicationRoles = resApplicationRole.body;
            for (let i = 0; i < this.applicationRoles.length; i++) {
              if (_.includes(position, this.applicationRoles[i].roleId)) {
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
    });
  }

  public onSelectAssignTo(event: any) {
    for (let i = 0; i < this.position.length; i++) {
      if (event.value === this.position[i].id) {
        this.applicationRole.applicationId = this.creditProposal.id;
        this.applicationRole.partyId = this.position[i].partyId;
        this.applicationRole.partyName = this.position[i].employeeFirstName;
        this.applicationRole.roleId = this.position[i].positionTypeId;
        this.applicationRole.roleDescription = this.position[i].positionTypeDescription;
      }
    }
    // send data to parent
    this.assignTo.emit({ applicationRole: this.applicationRole, applicationRoleId: this.applicationRoleId });
  }
}
