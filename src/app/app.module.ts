import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import {
    IgxHierarchicalGridModule,
    IgxDialogModule,
    IgxInputGroupModule,
    IgxButtonModule,
    IgxCheckboxModule,
    IgxDatePickerModule,
    IgxIconModule,
    IgxRippleModule,
    IgxCalendarModule,
    IgxGridModule
} from 'igniteui-angular';

import { AppComponent } from './app.component';
import { RemoteService } from 'src/services/remote.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FormsModule,
        IgxInputGroupModule,
        IgxDialogModule,
        IgxHierarchicalGridModule,
        IgxButtonModule,
        IgxCheckboxModule,
        IgxDatePickerModule,
        IgxGridModule.forRoot(),
        IgxCalendarModule,
        IgxIconModule,
        IgxRippleModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule
    ],
    providers: [HttpClient, RemoteService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
