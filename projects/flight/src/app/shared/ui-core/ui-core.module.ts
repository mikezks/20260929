import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HeaderbarComponent,
        SidebarComponent
    ],
    exports: [
        HeaderbarComponent,
        SidebarComponent
    ]
})
export class UiCoreModule { }
