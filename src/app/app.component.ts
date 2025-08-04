// Angular import
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// project import
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  imports: [SpinnerComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private bitrixApiUrl = `${environment.bitrixStockUrl}/bitrixapiurl`;
  title = 'datta-able';
  http: any;

  // life cycle hook
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  getBitrixApiUrl() {
    this.http.get(this.bitrixApiUrl).subscribe(data => {
      environment.apiUrl = data;
    })
  }
}
