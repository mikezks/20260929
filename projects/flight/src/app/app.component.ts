import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderbarComponent, SidebarComponent } from './shared/ui-core';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        HeaderbarComponent,
        SidebarComponent,
        RouterOutlet
    ]
})
export class AppComponent {
}
