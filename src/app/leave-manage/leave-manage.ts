import { Component,signal,inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
@Component({
  selector: 'app-leave-manage',
  imports: [MatDialogModule],
  templateUrl: './leave-manage.html',
  styleUrl: './leave-manage.css',
})
export class LeaveManage {
  activeTab = signal('pending');

  setTab(tab: string) {
    this.activeTab.set(tab);
  }

  private readonly dialog = inject(MatDialog);

  openFilter() {
    const dialogRef = this.dialog.open(FilterDialog, {
      width: '400px',
      panelClass: 'custom-filter-panel' // For custom Tailwind styling
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Filters applied:', result);
        // Refresh your table data here
      }
    });
  }
}
