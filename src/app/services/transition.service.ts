import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {
  private router = inject(Router);

  isTransitioning = signal(false);
  transitionColor = signal('');
  
  // Geometric coordinates for Hero Card Transition
  startX = signal(0);
  startY = signal(0);
  startW = signal(0);
  startH = signal(0);

  navigateWithAnimation(route: string, colorClass: string, rect: DOMRect) {
    this.isTransitioning.set(true);
    this.transitionColor.set(colorClass);
    
    this.startX.set(rect.left);
    this.startY.set(rect.top);
    this.startW.set(rect.width);
    this.startH.set(rect.height);

    // Give the card 400ms to expand and cover the screen, then instantly route.
    // The total animation will run longer to allow the new page to fade in.
    setTimeout(() => {
      this.router.navigate([route]);
    }, 450);

    // Destroy the overlay after 1000ms
    setTimeout(() => {
      this.isTransitioning.set(false);
      this.transitionColor.set('');
    }, 1000);
  }
}
