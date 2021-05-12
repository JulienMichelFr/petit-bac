import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UserModule } from './modules/user/user.module';
import { AppRoutingModuleModule } from './app-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoomModule } from './modules/room/room.module';
import { RoomPageComponent } from './pages/room-page/room-page.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { profileReducer } from './store/reducers/profile.reducer';
import { HasProfileGuard } from './guards/has-profile/has-profile.guard';
import { RoomInvitePageComponent } from './pages/room-invite-page/room-invite-page.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RoomExistGuard } from './guards/room-exist/room-exist.guard';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './store/effects';
import { metaReducers } from './store/meta-reducers';

const config: SocketIoConfig = { url: 'http://localhost:3333', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotFoundPageComponent,
    RoomPageComponent,
    RoomInvitePageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    UserModule,
    AppRoutingModuleModule,
    SocketIoModule.forRoot(config),
    RoomModule,
    StoreModule.forRoot(
      {
        profile: profileReducer,
      },
      {
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
      }
    ),
    EffectsModule.forRoot(AppEffects),
    environment.production
      ? undefined
      : StoreDevtoolsModule.instrument({ maxAge: 25 }),
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [HasProfileGuard, RoomExistGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
