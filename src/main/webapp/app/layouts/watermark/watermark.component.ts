import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-watermark',
  templateUrl: './watermark.component.html',
  styleUrls: ['./watermark.style.css'],
})
export class WatermarkComponent implements OnInit {
  public watermarkContent: String = '';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.defineWatermark();
  }

  private defineWatermark(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.watermarkContent = account.email;
      }
    });
  }
}
