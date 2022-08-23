import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { TemplateService } from '../template/template.service';
import { FlatNode, ISidebarMenuModel, SidebarMenuModel } from './sidebar.model';

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public account: Account | null = null;
  private treeData: ISidebarMenuModel[] = [
    {
      name: 'Master',
      children: [
        {
          name: 'Employee',
          route: 'employee',
        },
        {
          name: 'Position',
          route: 'position',
        },
      ],
    },
    {
      name: 'Initiation',
      children: [
        {
          name: 'Initial Debtor Data',
          route: 'cif',
        },
        {
          name: 'Credit Proposal',
          route: 'credit-proposal',
        },
        {
          name: 'SLIK Checking',
          route: '',
        },
      ],
    },
    {
      name: 'Appraisal',
      children: [
        {
          name: 'Request Appraisal',
          route: 'collateral-appraisal',
        },
        {
          name: 'Appraisal Distribution',
          route: 'collateral-appraisal-distribution',
        },
        {
          name: 'Appraisal Process/Report',
          route: 'collateral-appraisal-process-report',
        },
        {
          name: 'Appraisal Process Approval',
          route: 'collateral-appraisal-process-approval',
        },
        {
          name: 'Appraisal Report Upload (Independent)',
          route: 'collateral-appraisal-report-upload',
        },
        {
          name: 'Appraisal Result',
          route: '',
        },
      ],
    },
    {
      name: 'Credit Proposal',
      children: [
        {
          name: 'Credit Proposal',
          route: '',
        },
        {
          name: 'Credit Proposal Approval',
          route: '',
        },
      ],
    },
    {
      name: 'Loan Analysis & Approval',
      children: [
        {
          name: 'Loan Proposal Distribution',
          route: '',
        },
        {
          name: 'Loan Analysis',
          route: '',
        },
        {
          name: 'Loan Approval',
          route: '',
        },
      ],
    },
    {
      name: 'Offering Letter & Legal',
      children: [
        {
          name: 'Finalize & Review Offering Letter',
          route: '',
        },
        {
          name: 'Confirm Offering Letter',
          route: '',
        },
        {
          name: 'Legal Process',
          route: '',
        },
      ],
    },
    {
      name: 'Disbursment',
      children: [
        {
          name: 'Request Disbursment',
          route: '',
        },
        {
          name: 'Credit Administration',
          route: '',
        },
      ],
    },
    {
      name: 'MIS Report',
      route: '',
    },
  ];

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
    this.dataSource.data = this.treeData;
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  ngAfterViewInit(): void {
    // set open first node for treeview
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public toggleSidebar(): void {
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
      level: lvl,
      route: node.route,
    };
  }

  public hasChild(_: number, node: FlatNode): any {
    return node.expandable;
  }
}

/* import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { FlatNode, ISidebarMenuModel, SidebarMenuModel } from './sidebar.model';
import { sidebarAnimation, iconAnimation, labelAnimation } from '../../animations';
import { TemplateService } from '../template/template.service';

import * as lodash from 'lodash';

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [sidebarAnimation(), iconAnimation(), labelAnimation()],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public sidebarState: string;

  public account: Account | null = null;
  private treeData: ISidebarMenuModel[] = [
    {
      name: 'Master',
      iconname: 'pencil-alt',
      children: [
        {
          name: 'Employee',
          route: 'employee',
        },
        {
          name: 'Position',
          route: 'position',
        },
      ],
    },
    {
      name: 'Initiation',
      iconname: 'pencil-alt',
      children: [
        {
          name: 'Initial Debtor Data',
          route: 'credit-proposal',
        },
        {
          name: 'Credit Proposal',
          route: 'credit-proposal',
        },
        {
          name: 'SLIK Checking',
          route: '',
        },
      ],
    },
    {
      name: 'Appraisal',
      iconname: 'file',
      children: [
        {
          name: 'Request Appraisal',
          route: 'collateral-appraisal',
        },
        {
          name: 'Appraisal Distribution',
          route: 'collateral-appraisal-distribution',
        },
        {
          name: 'Appraisal Process/Report',
          route: 'collateral-appraisal-process-report',
        },
        {
          name: 'Appraisal Process Approval',
          route: 'collateral-appraisal-process-approval',
        },
        {
          name: 'Appraisal Report Upload (Independent)',
          route: 'collateral-appraisal-report-upload',
        },

        {
          name: 'Appraisal Result',
          route: '',
        },
      ],
    },
    {
      name: 'Credit Proposal',
      iconname: 'arrow-trend-up',
      children: [
        {
          name: 'Credit Proposal',
          route: '',
        },
        {
          name: 'Credit Proposal Approval',
          route: '',
        },
      ],
    },
    {
      name: 'Loan Analysis & Approval',
      iconname: 'file',
      children: [
        {
          name: 'Loan Proposal Distribution',
          route: '',
        },
        {
          name: 'Loan Analysis',
          route: '',
        },
        {
          name: 'Loan Approval',
          route: '',
        },
      ],
    },
    {
      name: 'Offering Letter & Legal',
      iconname: 'square-check',
      children: [
        {
          name: 'Finalize & Review Offering Letter',
          route: '',
        },
        {
          name: 'Confirm Offering Letter',
          route: '',
        },
        {
          name: 'Legal Process',
          route: '',
        },
      ],
    },
    {
      name: 'Disbursment',
      iconname: 'paperclip',
      children: [
        {
          name: 'Request Disbursment',
          route: '',
        },
        {
          name: 'Credit Administration',
          route: '',
        },
      ],
    },
    {
      name: 'MIS Report',
      iconname: 'file-lines',
      route: '',
    },
  ];

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
    this.dataSource.data = this.treeData;
  }

  ngOnInit(): void {
    this.checkLogin();
    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      this.sidebarState = newState;
    });
  }

  ngAfterViewInit(): void {
    // set open first node for treeview
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public toggleSideBar(): void {
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
}*/
