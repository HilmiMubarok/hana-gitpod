import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { TemplateService } from '../template/template.service';
import { FlatNode, ISidebarMenuModel, SidebarMenuModel } from './sidebar.model';
import { sidebarAnimation, iconAnimation, labelAnimation } from '../../animations';
import lodash from 'lodash';
import {
  APPRAISAL_MENU_ADMIN,
  APPRAISAL_MENU_RM,
  APPRAISAL_MENU_SURVEYOR,
  APPRAISAL_MENU_APPROVAL,
  APPRAISAL_MENU_ADMIN_APPRAISAL,
} from './menu-side-bar';

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

  public treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  public treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  public dataSource: any = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private accountService: AccountService, private router: Router, private templateService: TemplateService) {
    this.accountService.identity().subscribe(account => {
      if (lodash.indexOf(account.authorities, 'ROLE_ADMIN') >= 0) {
        this.dataSource.data = APPRAISAL_MENU_ADMIN;
      } else if (lodash.indexOf(account.authorities, 'ROLE_ADMIN') < 1) {
        if (lodash.indexOf(account.authorities, 'ROLE_SURVEYOR') >= 0) {
          this.dataSource.data = APPRAISAL_MENU_SURVEYOR;
        } else if (lodash.indexOf(account.authorities, 'ROLE_RM') >= 0) {
          this.dataSource.data = APPRAISAL_MENU_RM;
        } else if (lodash.indexOf(account.authorities, 'ROLE_TL') >= 0) {
          this.dataSource.data = APPRAISAL_MENU_APPROVAL;
        } else if (lodash.indexOf(account.authorities, 'ROLE_ADMIN_APPRAISER') >= 0) {
          this.dataSource.data = APPRAISAL_MENU_ADMIN_APPRAISAL;
        } else if (lodash.indexOf(account.authorities, 'ROLE_ADMIN') < 1) {
          this.dataSource.data = APPRAISAL_MENU_ADMIN;
        }
      }
    });

    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      if (newState === 'close') {
        this.tree.treeControl.collapseAll();
      }
    });
  }

  ngOnInit(): void {
    this.checkLogin();
    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      this.sidebarState = newState;
    });
    // if (lodash.indexOf(this.account.authorities, 'ROLE_ADMIN') >= 0) {
    //   this.treeData[2];
    // } else {
    // }
    console.log('tree', this.treeData[2]);
  }

  ngAfterViewInit(): void {
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;

        console.log('account side', account);
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
