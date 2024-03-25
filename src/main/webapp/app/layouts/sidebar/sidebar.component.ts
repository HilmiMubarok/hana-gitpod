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
  APPRAISAL_MENU_LEGALOFFICER_OUTREGION,
  APPRAISAL_MENU_SIDEBAR_ALL,
  MENU_MASTER,
  APPRAISAL_MENU_ADMIN_CONFIG,
  MENU_MASTER_CONFIG,
  SLIK_MENU_BUSINESS_SUPPORT,
  DASHBOARD,
  FORBIDDEN_MENU,
  DEVELOPER_MENU,
} from './menu-side-bar';
import { Authority } from 'app/config/authority.constants';
import { LoginService } from 'app/login/login.service';
import { PositionService } from 'app/entities/position/position.service';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { createRequestOption } from 'app/core/request/request-util';

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

  private positionIdLocStor: string;
  private resourceUrlMenu = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-position-type');

  constructor(
    private accountService: AccountService,
    private router: Router,
    private templateService: TemplateService,
    protected loginService: LoginService,
    protected positionService: PositionService,
    protected applicationConfigService: ApplicationConfigService,
    protected http?: HttpClient
  ) {
    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      if (newState === 'close') {
        this.tree.treeControl.collapseAll();
      }
    });
  }

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
  public forbiddenDataSource: any = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  public developerDataSource: any = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private convertDateArrayFromServer(res: HttpResponse<any[]>): HttpResponse<any[]> {
    return res;
  }

  private itemPreLoad(item: any): any {
    return item;
  }

  private preLoadItemArray(res: HttpResponse<any[]>): HttpResponse<any[]> {
    res.body.forEach(item => {
      this.itemPreLoad(item);
    });
    return res;
  }

  private queryFilterBy(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrlMenu + '/filterBy', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  private setMenu(menusData: any): void {
    let orderNum = 0;
    let parentMenus = [];
    let parentMenusLength = 0;
    const filteredParentMenus = [];
    let filteredParentMenusLength = 0;
    const dataSourceTemp = [];

    menusData.forEach(menu => {
      orderNum++;
      parentMenus.push({
        id: menu.parentMenuItemId,
        menuItemId: menu.menuItemId,
        descripton: menu.parentMenuItemDescription,
        icon: menu.parentMenuItemIcon,
        order: orderNum,
      });
    });
    parentMenus = lodash.uniqBy(parentMenus, 'id');
    parentMenus.sort((a, b) => (a.order > b.order ? 1 : -1));
    parentMenusLength = parentMenus.length;

    for (let x = 0; x < parentMenus.length; x++) {
      filteredParentMenus.push(parentMenus[x]);
    }
    filteredParentMenusLength = filteredParentMenus.length;

    console.log('paretnMenu', parentMenus);

    for (let x = filteredParentMenusLength - 1; x >= 0; x--) {
      for (let y = 0; y < parentMenusLength; y++) {
        if (parentMenus[y].menuItemId === filteredParentMenus[x].id) {
          filteredParentMenus.splice(x, 1);
          parentMenusLength = parentMenusLength - 1;
        }
      }
    }

    console.log('filteredParentMenus', filteredParentMenus);

    // parentMenus.forEach(parentMenu => {
    filteredParentMenus.forEach(parentMenu => {
      dataSourceTemp.push({
        name: parentMenu.descripton,
        iconname: parentMenu.icon,
        children: [],
      });
    });

    dataSourceTemp.forEach(data => {
      menusData.forEach(menu => {
        if (menu.parentMenuItemDescription === data.name) {
          data.children.push({
            name: menu.menuItemDescription,
            iconname: menu.menuItemIcon,
            route: menu.menuItemcode,
          });
        }
      });
    });
    this.dataSource.data = dataSourceTemp;
  }

  private getMenuByPos(newPositionTypeId: string): void {
    this.queryFilterBy({
      positionTypeId: newPositionTypeId,
      sort: ['id', 'asc'],
    }).subscribe(menus => {
      this.setMenu(menus.body.filter(obj => !obj.menuItemId.includes('DASHBOARD_')));
    });
  }

  private setMenuFromPosInt(newPosSet: any): void {
    if (newPosSet !== 'Empty') {
      this.accountService.identity().subscribe(account => {
        if (lodash.indexOf(account.authorities, Authority.ADMIN) >= 0) {
          this.dataSourceDashboard.data = DASHBOARD;
          this.dataSource.data = APPRAISAL_MENU_ADMIN;
          this.dataSourceConfig.data = APPRAISAL_MENU_ADMIN_CONFIG;
        } else if (lodash.indexOf(account.authorities, Authority.ADMIN) < 1) {
          this.getMenuByPos(newPosSet.positionTypeId);
        }
      });
    } else {
      this.dataSource.data = [];
    }
    this.router.navigate(['']);
  }

  private logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    this.checkLogin();
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.setMenuFromPosInt(newPos);
    });
    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      this.sidebarState = newState;
    });
    this.forbiddenDataSource.data = FORBIDDEN_MENU;
    this.developerDataSource.data = DEVELOPER_MENU;
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
