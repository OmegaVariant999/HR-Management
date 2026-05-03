import { Component, signal, inject, effect, model } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserData } from '../../services/auth.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  public authService = inject(AuthService);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private leaveService = inject(LeaveService);

  // Form signals using model() for two-way binding
  name = model('');
  email = model('');
  phone = model('');
  location = model('');
  role = model('');
  photoURL = model('');
  isSaving = signal(false);

  constructor() {
    // Sync local signals with auth data when it changes
    effect(() => {
      const data = this.authService.userData();
      if (data) {
        this.name.set(data.name || '');
        this.email.set(data.email || '');
        this.phone.set(data.phone || '');
        this.location.set(data.location || '');
        this.role.set(data.role || '');
        this.photoURL.set(data.photoURL || '');
      }
    }, { allowSignalWrites: true });
  }

  async onSave() {
    const user = this.authService.currentUser();
    if (!user || this.isSaving()) return;

    this.isSaving.set(true);
    try {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      
      const updateData: any = {
        name: this.name(),
        phone: this.phone(),
        location: this.location()
      };

      // Only include photoURL if it's not too large (Firestore limit is 1MB total per doc)
      if (this.photoURL()) {
        updateData.photoURL = this.photoURL();
      }

      await updateDoc(userDocRef, updateData);
      
      setTimeout(() => {
        this.isSaving.set(false);
        alert('Profile updated successfully!');
      }, 500);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      this.isSaving.set(false);
      
      if (error.code === 'permission-denied') {
        alert('Permission Denied: Please ensure you have applied the Firestore Security Rules provided in the walkthrough.');
      } else if (this.photoURL() && this.photoURL().length > 800000) {
        alert('Image too large! Please choose a smaller image (under 1MB).');
      } else {
        alert(`Update failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Basic size check before processing
      if (file.size > 1024 * 1024) {
        alert('File is too large! Please select an image under 1MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          // Compress image using canvas
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed jpeg
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          this.photoURL.set(compressedDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    document.getElementById('avatar-input')?.click();
  }

  initials(name: string | undefined): string {
    if (!name || !name.trim()) return '??';
    const parts = name.trim().split(/\s+/);
    return parts.map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  goToSecurity() {
    this.router.navigate(['/settings'], { queryParams: { tab: 'security' } });
  }

  goToNotifications() {
    this.router.navigate(['/settings'], { queryParams: { tab: 'notifications' } });
  }

  applyLeave() {
    this.router.navigate(['/apply-leave']);
  }

  recentLeaveStatus() {
    const user = this.authService.userData();
    if (!user) return null;

    const myLeaves = this.leaveService.getLeavesByEmployee(user.uid);
    if (myLeaves.length === 0) return null;

    // Check for leaves within a week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentLeave = myLeaves.find(l => {
      const appliedAt = l.appliedAt?.toDate ? l.appliedAt.toDate() : new Date(l.appliedAt);
      return appliedAt >= oneWeekAgo;
    });

    if (!recentLeave) return null;

    if (recentLeave.status === 'pending') return 'In Process';
    if (recentLeave.status === 'approved') return 'Approved';
    if (recentLeave.status === 'rejected') return 'Rejected';
    return null;
  }
}
