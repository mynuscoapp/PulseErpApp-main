// src/app/theme/shared/service/navigation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private roleMenuMapUrl = `${environment.bitrixStockUrl}/role-menu-map`;

  constructor(private http: HttpClient) {}

  /** fetch { role: string[]of menu titles } from backend */
  getRoleMenuMap(): Observable<Record<string, string[]>> {
    return this.http.get<Record<string, string[]>>(this.roleMenuMapUrl);
  }

  /** filter NavigationItems by role using backend map */
  filterNavigationByRole(items: NavigationItem[], role: string): Observable<NavigationItem[]> {
    return this.getRoleMenuMap().pipe(
      map(mapObj => {
        const allowed = new Set((mapObj[role?.toLowerCase?.()] || []));
        const filter = (nodes: NavigationItem[]): NavigationItem[] =>
          nodes
            .map(n => {
              const children = n.children ? filter(n.children) : undefined;
              const include = allowed.has(n.title) || (children && children.length > 0);
              return include ? { ...n, children } : null;
            })
            .filter(x => !!x);
        return filter(items);
      })
    );
  }

  /** find the menu title for a given route url using NavigationItems */
  findTitleByUrl(items: NavigationItem[], url: string): string | null {
    const normalize = (u: string) => ('/' + u).replace(/\/+/g, '/').split('?')[0];
    const search = (nodes: NavigationItem[]): string | null => {
      for (const n of nodes) {
        if (n.url && normalize(n.url) === normalize(url)) return n.title;
        if (n.children) {
          const found = search(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(items);
  }
}
