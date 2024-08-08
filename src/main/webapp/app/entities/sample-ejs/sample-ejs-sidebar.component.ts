import { Component, ViewChild } from '@angular/core';
import { ClickEventArgs, SidebarComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-service-sample-ejs-sidebar',
  templateUrl: './sample-ejs-sidebar.component.html',
  styleUrls: ['./sample-ejs-sidebar.style.css'],
})
export class SampleEjsSidebarComponent {
  @ViewChild('sidebar')
  public sidebarobj: SidebarComponent;

  public treeData: { [key: string]: Object }[] = [
    { id: '1', name: 'Menu1', hasChild: true, expanded: true },
    { id: '2', name: 'SubMenu1-1', selected: true, pid: '1' },
    { id: '3', name: 'SubMenu1-2', pid: '1' },
    { id: '5', name: 'Menu2', hasChild: true, expanded: true },
    { id: '6', name: 'SubMenu2-1', pid: '5' },
    { id: '7', name: 'SubMenu2-2', pid: '5' },
    { id: '8', name: 'SubMenu2-3', pid: '5' },
    { id: '9', name: 'SubMenu2-4', pid: '5' },
    { id: '12', name: 'SubMenu2-5', pid: '5' },
  ];
  public fields: { [key: string]: Object } = { id: 'id', text: 'text' };
  public treeFields: { [key: string]: Object } = {
    dataSource: this.treeData,
    id: 'id',
    text: 'name',
    selected: 'selected',
    parentID: 'pid',
    hasChildren: 'hasChild',
    expanded: 'expanded',
  };

  constructor() {}

  toolbarCliked(args: ClickEventArgs) {
    if (args.item.tooltipText === 'Menu') {
      this.sidebarobj.toggle();
    }
  }
}
