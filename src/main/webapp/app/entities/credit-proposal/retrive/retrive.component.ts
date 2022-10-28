import { Component } from '@angular/core';
import { retriveData } from './retrive.constant';

@Component({
  selector: 'jhi-retrive',
  templateUrl: './retrive.component.html',
  styleUrls: ['./retrive.css'],
})
export class RetriveComponent {
    public displayColumns: string[] = ['year','amountcode', 'accountname', 'currency', 'amount1'];
    public listOfValue = {
      currencyList: ['USD', 'IDR'],
    };
    public showHide = false;
    public getMenu : string;

    public dataRetrive : any = retriveData 


  showHideButton(){
    this.getMenu = sessionStorage.getItem('menu')
    if(this.getMenu === 'retrive-info'){
      console.log('masuk')
      this.showHide = true;
    }else{
      this.showHide = false;
    }
  }


}