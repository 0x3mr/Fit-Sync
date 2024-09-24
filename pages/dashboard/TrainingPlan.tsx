import React from 'react';
import { FaDumbbell } from 'react-icons/fa';
import MusclePlan from './Muscles';
import { TrainingPlanType, Exercise } from '@/app/models/User';
import threeDPlan from '../../constants/3dPlan.json'
import fourDPlan from '../../constants/4dPlan.json'
import fiveDPlan from '../../constants/5dPlan.json'


const TrainingPlan: React.FC<{
  plan: TrainingPlanType;
}> = ({ plan }) => {
  console.log('TPPPPPPPPPPDPDPDPDPDD', plan);
  const dayPlan = plan?.plan?.id;
  const index = Number(dayPlan?.split(':')[1][0]);
  const file = dayPlan?.split(':')[0];
  let finalData = null;
  let exer: Exercise[] = [];

  let jsonP: any[] = [];
  switch (file) {
    case '3d':
      jsonP = threeDPlan;
      break;
    case '4d':
      jsonP = fourDPlan;
      break;
    case '5d':
      jsonP = fiveDPlan;
      break;
  }
  finalData = jsonP[index - 1];
  console.log(finalData, index, file);
  if (finalData){
    exer = finalData.exercises as Exercise[];
  }

  return (


    <div className="training-plan">
      <h2 className="training-plan-title">
        <span className="inline-flex items-center gap-3">
          <FaDumbbell className="mr-2" /> Today's Training Plan
        </span>
      </h2>
      <h3 className="training-plan-title">{plan?.plan?.name}</h3>
      <ul className="training-plan-list list-disc pl-5">
        <li>Warm-up: 10 minutes cardio</li>
        {exer?.map((exercise, index) => (
          <li key={index}>{exercise.name}: {exercise.sets} sets of {exercise.reps || exercise.duration}</li>
        ))}
        <li>Cool-down: Stretching and light cardio</li>
      </ul>
      <br></br>
      {finalData ? <MusclePlan active={finalData.active} /> : null}
    </div>
  );
};

export default TrainingPlan;
