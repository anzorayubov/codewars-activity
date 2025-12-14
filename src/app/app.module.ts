import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HeaderComponent } from './components/header/header.component';

@NgModule({ declarations: [
        AppComponent,
        CalendarComponent,
        HeaderComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
