import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeEntriesComponent } from './component/time-entry/time-entries.component';
import { TaskComponent } from './component/task/task.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SettingsComponent } from './component/settings/settings.component';
import { AlertsModule } from './shared/component/alerts/alerts.module';
import { Routes, RouterModule } from '@angular/router';
import { DebounceDirective } from './shared/directives/debounce.directive';

const appRoutes: Routes = [
  { path: 'time-entries', component: TimeEntriesComponent },
  { path: '', redirectTo: '/time-entries', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TimeEntriesComponent,
    TaskComponent,
    SettingsComponent,
    DebounceDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    AlertsModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
