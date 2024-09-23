import React from 'react';
import { FaDumbbell } from 'react-icons/fa';
import MusclePlan from './Muscles';
import plan from '../../constants/trPlans.json'
// import "@/app/assets/styles/trainingPlan.css"; // Add a separate CSS file for styles



const TrainingPlan: React.FC<{
  active: number;
}> = ({ active }) => {
  const dayPlan = plan[active]?.exercises || [];

  return (


    <div className="training-plan">
      <h2 className="training-plan-title">
        <span className="inline-flex items-center gap-3">
          <FaDumbbell className="mr-2" /> Today's Training Plan
        </span>
      </h2>
      <h3 className="training-plan-title">{plan[active]?.name}</h3>
      <ul className="training-plan-list list-disc pl-5">
        <li>Warm-up: 10 minutes cardio</li>
        {dayPlan.map((exercise, index) => (
          <li key={index}>{exercise.name}: {exercise.sets} sets of {exercise.reps || exercise.duration}</li>
        ))}
        <li>Cool-down: Stretching and light cardio</li>
      </ul>
      <br></br>
      <MusclePlan active={plan[active]?.active} />
    </div>
  );
};

export default TrainingPlan;
