import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-sidebar-cmp',
    templateUrl: './sidebar.component.html',
    imports: [RouterLinkActive, RouterLink]
})
export class SidebarComponent {}
