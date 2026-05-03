import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA5vOuOWXQOsb3h6RZ1-7Lmg3CjTixqYAE",
  authDomain: "gen-v-hr.firebaseapp.com",
  projectId: "gen-v-hr",
  storageBucket: "gen-v-hr.firebasestorage.app",
  messagingSenderId: "504568670202",
  appId: "1:504568670202:web:c52cd481b61401d37de643"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
