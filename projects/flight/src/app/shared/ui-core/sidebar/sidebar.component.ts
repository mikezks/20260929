import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-sidebar-cmp',
  standalone: false,
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {}
