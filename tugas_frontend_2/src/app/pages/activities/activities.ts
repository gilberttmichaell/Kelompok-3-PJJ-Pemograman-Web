import { Component,  ChangeDetectorRef} from '@angular/core';


import { CommonModule } from '@angular/common';
import { ActivityModel } from '../../models/activity';
import { ActivityService } from '../../services/activity.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-Activity',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './activities.html',
  styleUrl: './activities.css'
})
export class Activity {

  activities: ActivityModel[] = [];

showForm = false;


newActivity: ActivityModel = {
  customer_id: 0,
  type: '',
  description: '',
  activity_date: '',
  created_by: 1
};
  constructor(
    private ActivityService: ActivityService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
  this.loadActivities();
}

loadActivities(): void {

  this.ActivityService.getAll().subscribe({
    next: (res) => {

      this.activities = res.data;

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error(err);
    }
  });
}
createActivity(): void {

  this.ActivityService.create(this.newActivity)
    .subscribe({

      next: (res) => {

        alert(res.message);

        this.newActivity = {
          customer_id: 0,
          type: '',
          description: '',
          activity_date: '',
          created_by: 1
        };

        this.showForm = false;

        this.loadActivities();
      },

      error: (err) => {
        console.error(err);
      }

    });
}
}