import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ServicioService } from './provider/servicio.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { AuthInterceptor } from './provider/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: ServicioService, useClass: ServicioService },
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
