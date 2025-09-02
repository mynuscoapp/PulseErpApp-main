// src/app/theme/layout/admin/navigation/nav-content/nav-content.component.ts
import { Component, inject, output, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

@Component({
  selector: 'app-nav-content',
  imports: [SharedModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private navigationService = inject(NavigationService);

  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: NavigationItem[];
  wrapperWidth: number;
  windowWidth = window.innerWidth;

  NavCollapsedMob = output();

  ngOnInit() {
    const role = (localStorage.getItem('userRole') || 'employee').toLowerCase();

    this.navigationService
      .filterNavigationByRole(NavigationItems, role)
      .subscribe({
        next: filtered => (this.navigations = filtered),
        error: err => {
          console.error('Failed to build menu by role:', err);
          this.navigations = NavigationItems; // fallback
        }
      });
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele) {
      const parent = ele.parentElement!;
      const up_parent = parent.parentElement!.parentElement!;
      const last_parent = up_parent.parentElement!;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger', 'active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger', 'active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger', 'active');
      }
    }
  }
}
