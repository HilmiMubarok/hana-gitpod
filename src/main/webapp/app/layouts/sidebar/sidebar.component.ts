import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { TemplateService } from '../template/template.service';
import { FlatNode, ISidebarMenuModel, SidebarMenuModel } from './sidebar.model';
import { sidebarAnimation, iconAnimation, labelAnimation } from '../../animations';
import {
  APPRAISAL_MENU_ADMIN,
  APPRAISAL_MENU_SURVEYOR,
  APPRAISAL_MENU_CHECKER,
  APPRAISAL_MENU_CHECKER1,
  APPRAISAL_MENU_CHECKER2,
  APPRAISAL_MENU_ADMIN_APPRAISAL,
  APPRAISAL_MENU_RM,
  SIDEBAR_MENU_BM,
  SIDEBAR_MENU_SME_HEAD,
  SIDEBAR_MENU_ROLE_SME_HEAD,
  SIDEBAR_MENU_DH,
  APPRAISAL_MENU_TL,
  APPRAISAL_MENU_CRA,
  APPRAISAL_MENU_HCR,
  APPRAISAL_MENU_LEGAL_TEAM_LEAD,
  APPRAISAL_MENU_BUSINESS_DIR,
  APPRAISAL_MENU_CREDIT_DIR,
  APPRAISAL_MENU_FINANCE_DIR,
  APPRAISAL_MENU_CC_ANALYST,
  APPRAISAL_MENU_CC_ADMIN,
  APPRAISAL_MENU_CC_DEPT_HEAD,
  APPRAISAL_MENU_CC_DH,
  APPRAISAL_MENU_CC_DIR,
  APPRAISAL_MENU_LEGAL_HEAD,
  APPRAISAL_MENU_LEGAL_OFFICER,
  APPRAISAL_MENU_CRO,
  APPRAISAL_DEPT_HEAD,
  APPRAISAL_DEPT_CREDIT_LEGAL_LEAD,
  SIDEBAR_MENU_APR_DH,
  APPRAISAL_APR_DEPT_HEAD,
  APPRAISAL_MENU_SIDEBAR_ALL,
  MENU_MASTER,
  APPRAISAL_MENU_ADMIN_CONFIG,
  MENU_MASTER_CONFIG,
  DASHBOARD,
} from './menu-side-bar';
import { Authority } from 'app/config/authority.constants';
import { LoginService } from 'app/login/login.service';
import { PositionService } from 'app/entities/position/position.service';
import lodash from 'lodash';

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [sidebarAnimation(), iconAnimation(), labelAnimation()],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('tree') public tree;
  public account: Account | null = null;
  public sidebarState: string;
  private treeData: ISidebarMenuModel[];
  public userRole: string;

  public treeControlDashboard = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  public treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  public treeControlConfig = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  public treeFlattenerDashboard = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  public treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  public treeFlattenerConfig = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  public dataSourceDashboard: any = new MatTreeFlatDataSource(this.treeControlDashboard, this.treeFlattenerDashboard);
  public dataSource: any = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  public dataSourceConfig: any = new MatTreeFlatDataSource(this.treeControlConfig, this.treeFlattenerConfig);

  private positionIdLocStor: string;

  private setMenuFromPosInt(newPosSet: string): void {
    if (newPosSet !== 'Empty') {
      this.accountService.identity().subscribe(account => {
        if (lodash.indexOf(account.authorities, Authority.ADMIN) >= 0) {
          this.dataSourceDashboard.data = DASHBOARD;
          this.dataSource.data = APPRAISAL_MENU_ADMIN;
          this.dataSourceConfig.data = APPRAISAL_MENU_ADMIN_CONFIG;
        } else if (lodash.indexOf(account.authorities, Authority.ADMIN) < 1) {
          if (newPosSet === 'MASTER_ADMIN') {
            this.dataSource.data = MENU_MASTER;
          } else if (newPosSet === 'SURVEYOR') {
            this.dataSource.data = APPRAISAL_MENU_SURVEYOR;
          } else if (newPosSet === 'RM') {
            this.dataSource.data = APPRAISAL_MENU_RM;
          } else if (newPosSet === 'BM') {
            this.dataSource.data = SIDEBAR_MENU_BM;
          } else if (newPosSet === 'SME_HEAD') {
            this.dataSource.data = SIDEBAR_MENU_SME_HEAD;
          } else if (newPosSet === 'SDH') {
            this.dataSource.data = SIDEBAR_MENU_ROLE_SME_HEAD;
          } else if (newPosSet === 'DH') {
            this.dataSource.data = SIDEBAR_MENU_DH;
          } else if (newPosSet === 'APR_DH') {
            this.dataSource.data = SIDEBAR_MENU_APR_DH;
          } else if (newPosSet === 'TL') {
            this.dataSource.data = APPRAISAL_MENU_TL;
          } else if (newPosSet === 'CRA') {
            this.dataSource.data = APPRAISAL_MENU_CRA;
          } else if (newPosSet === 'CRC') {
            this.dataSource.data = APPRAISAL_MENU_CHECKER;
          } else if (newPosSet === 'CRC1') {
            this.dataSource.data = APPRAISAL_MENU_CHECKER1;
          } else if (newPosSet === 'CRC2') {
            this.dataSource.data = APPRAISAL_MENU_CHECKER2;
          } else if (newPosSet === 'LEGAL_TEAM_LEAD') {
            this.dataSource.data = APPRAISAL_MENU_LEGAL_TEAM_LEAD;
          } else if (newPosSet === 'HCR1' || newPosSet === 'ROLE_HCR2') {
            this.dataSource.data = APPRAISAL_MENU_HCR;
          } else if (newPosSet === 'BUSINESS_DIR') {
            this.dataSource.data = APPRAISAL_MENU_BUSINESS_DIR;
          } else if (newPosSet === 'CREDIT_DIR') {
            this.dataSource.data = APPRAISAL_MENU_CREDIT_DIR;
          } else if (newPosSet === 'CC_ANALYST') {
            this.dataSource.data = APPRAISAL_MENU_CC_ANALYST;
          } else if (newPosSet === 'FINANCE_DIR') {
            this.dataSource.data = APPRAISAL_MENU_FINANCE_DIR;
          } else if (newPosSet === 'CC_ADMIN') {
            this.dataSource.data = APPRAISAL_MENU_CC_ADMIN;
          } else if (newPosSet === 'CC_DEPT_HEAD') {
            this.dataSource.data = APPRAISAL_MENU_CC_DEPT_HEAD;
          } else if (newPosSet === 'CC_DH') {
            this.dataSource.data = APPRAISAL_MENU_CC_DH;
          } else if (newPosSet === 'CC_DIR') {
            this.dataSource.data = APPRAISAL_MENU_CC_DIR;
          } else if (newPosSet === 'LEGAL_HEAD') {
            this.dataSource.data = APPRAISAL_MENU_LEGAL_HEAD;
          } else if (newPosSet === 'LEGAL_OFFICER') {
            this.dataSource.data = APPRAISAL_MENU_LEGAL_OFFICER;
          } else if (newPosSet === 'CRO') {
            this.dataSource.data = APPRAISAL_MENU_CRO;
          } else if (newPosSet === 'DEPT_HEAD') {
            this.dataSource.data = APPRAISAL_DEPT_HEAD;
          } else if (newPosSet === 'APR_DEPT_HEAD') {
            this.dataSource.data = APPRAISAL_APR_DEPT_HEAD;
          } else if (newPosSet === 'CREDIT_LEGAL_LEAD') {
            this.dataSource.data = APPRAISAL_DEPT_CREDIT_LEGAL_LEAD;
          } else if (newPosSet === 'ADMIN_APPRAISER') {
            this.dataSource.data = APPRAISAL_MENU_ADMIN_APPRAISAL;
          }
        }
      });
    } else {
      this.dataSource.data = [];
    }
    this.router.navigate(['']);
  }

  constructor(
    private accountService: AccountService,
    private router: Router,
    private templateService: TemplateService,
    protected loginService: LoginService,
    protected positionService: PositionService
  ) {
    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      if (newState === 'close') {
        this.tree.treeControl.collapseAll();
      }
    });
  }

  private logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    this.checkLogin();
    this.templateService.triggerChanggedPosIntObservable.subscribe((newPos: string) => {
      this.setMenuFromPosInt(newPos);
    });
    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      this.sidebarState = newState;
    });
  }

  ngAfterViewInit(): void {
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public selectedNode(): void {
    this.templateService.toggle();
  }

  public selectedIcon(): void {
    this.templateService.toggle();
  }

  public getClassActive(route: string): string {
    const currentUrl = this.router.url;
    if (currentUrl === '/' + route) {
      return 'selected';
    }
    return null;
  }

  private transformer(node: SidebarMenuModel, lvl: number): any {
    const exp = !!node.children && node.children.length > 0;
    return {
      expandable: exp,
      name: node.name,
      iconname: node.iconname,
      level: lvl,
      route: node.route,
    };
  }

  public hasChild(_: number, node: FlatNode): any {
    return node.expandable;
  }
}
