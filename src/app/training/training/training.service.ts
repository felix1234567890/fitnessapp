import { Subject } from "rxjs";
import { Exercise } from "./exercise.model";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";
import { UIService } from "../../shared/ui.service";

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];
  // private availableExercises: Exercise[] = [
  //   {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
  //   {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
  //   {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
  //   {id: 'burpees', name: 'Burpees', duration: 60, calories: 8},
  // ];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];
  private availableExercises: Exercise[];
  private finishedExercises: Exercise[] = [];

  constructor(private db: AngularFirestore, private uiService:UIService) {}
  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/'+selectedId).update({lastSelected: new Date})
    const selectedExercise = this.availableExercises.find(
      object => object.id === selectedId
    );
    this.runningExercise = selectedExercise;
    this.exerciseChanged.next({ ...this.runningExercise });
  }
  completeExercise() {
    // this.exercises.push({
    //   ...this.runningExercise,
    //   date: new Date(),
    //   state: "completed"
    // });
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
  cancelExercise(progress: number) {
    // this.exercises.push({
    //   ...this.runningExercise,
    //   duration: this.runningExercise.duration * (progress / 100),
    //   calories: this.runningExercise.calories * (progress / 100),
    //   state: "canceled",
    //   date: new Date()
    // });
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      state: "canceled",
      date: new Date()
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
  getAvailableExercises() {
    // return this.availableExercises.slice()
    this.fbSubs.push(
      this.db
        .collection("availableExercises")
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                ...doc.payload.doc.data()
              };
            });
          })
        )
        .subscribe((exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        },error => {this.uiService.showSnackbar('Fetching failed', null, 3000)}
        
        )
    );
  }
  getRunningExercise() {
    return { ...this.runningExercise };
  }
  getCompletedOrCanceledExercises() {
    //return this.exercises.slice();
    this.fbSubs.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        })
    );
  }
  private async addDataToDatabase(exercise: Exercise) {
    try {
      await this.db.collection("finishedExercises").add(exercise);
    } catch {
      error => console.log(error);
    }
  }
  cancelSuscriptions(){
    this.fbSubs.forEach(
      sub => sub.unsubscribe()
    )
  }
}
