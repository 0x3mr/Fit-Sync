import React from 'react';
import { FaUtensils } from 'react-icons/fa';
// import "@/app/assets/styles/dietPlan.css"; // Add a separate CSS file for styles

const DietPlan: React.FC = () => {
  return (
    <div className="diet-plan">
      <h2 className="diet-plan-title"><FaUtensils /> Today's Diet Plan</h2>
      <ul className="diet-plan-list">
        <li>Breakfast: Oats with berries and nuts</li>
        <li>Lunch: Grilled chicken salad</li>
        <li>Snack: Protein shake and almonds</li>
        <li>Dinner: Salmon with steamed veggies</li>
        <li>Post-workout: Greek yogurt and banana</li>
      </ul>
    </div>
  );
};

export default DietPlan;
