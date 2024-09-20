import React from 'react';
import { FaDumbbell } from 'react-icons/fa';
// import "@/app/assets/styles/trainingPlan.css"; // Add a separate CSS file for styles

const TrainingPlan: React.FC = () => {
  return (
    <div className="training-plan">
      <h2 className="training-plan-title"><FaDumbbell /> Today's Training Plan</h2>
      <ul className="training-plan-list">
        <li>Warm-up: 10 minutes cardio</li>
        <li>Squats: 4 sets of 12 reps</li>
        <li>Bench Press: 4 sets of 10 reps</li>
        <li>Deadlifts: 4 sets of 8 reps</li>
        <li>Cool-down: Stretching and light cardio</li>
      </ul>
    </div>
  );
};

export default TrainingPlan;
