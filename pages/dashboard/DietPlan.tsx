import React, { useState } from "react";
import { FaAppleAlt } from "react-icons/fa";
import calorieUnderweightPlan from "../../constants/calorieUnderweight.json";
import calorieNormalPlan from "../../constants/calorieNormal.json";
import calorieOverweightPlan from "../../constants/calorieOverweight.json";
import calorieObesePlan from "../../constants/calorieObese.json";

interface Meal {
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  isVegetarian: boolean;
  isHighProtein: boolean;
}

interface DietPlanProps {
  bmi: number; // Ensure bmi is a number
}

const DietPlan: React.FC<DietPlanProps> = ({ bmi }) => {
  const [dietPreference, setDietPreference] = useState<"all" | "vegetarian" | "highProtein">("all");

  // Helper function to get the diet plan based on BMI ratio
  const getCaloriePlan = (ratio: number) => {
    if (ratio < 18.5) return calorieUnderweightPlan; // Underweight
    if (ratio >= 18.5 && ratio < 24.9) return calorieNormalPlan; // Normal weight
    if (ratio >= 25 && ratio < 29.9) return calorieOverweightPlan; // Overweight
    return calorieObesePlan; // Obese
  };

  const caloriePlan = getCaloriePlan(bmi);
  let meals: Meal[] = [];

  if (caloriePlan) {
    meals = caloriePlan[0].meals.flatMap((meal: any) =>
      meal.choices.filter((choice: Meal) => {
        if (dietPreference === "all") return true;
        if (dietPreference === "vegetarian") return choice.isVegetarian;
        if (dietPreference === "highProtein") return choice.isHighProtein;
        return false;
      })
    );
  }

  return (
    <div className="diet-plan">
      <h2 className="diet-plan-title">
        <span className="inline-flex items-center gap-3">
          <FaAppleAlt className="mr-2" /> Today's Diet Plan
        </span>
      </h2>

      {/* Diet Preference Toggle */}
      <div className="diet-preference-toggle">
        <label>Diet Preference:</label>
        <select
          value={dietPreference}
          onChange={(e) => setDietPreference(e.target.value as "all" | "vegetarian" | "highProtein")}
        >
          <option value="all">All</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="highProtein">High Protein</option>
        </select>
      </div>

      {/* List of meals with nutritional breakdown */}
      <ul className="diet-plan-list list-disc pl-5">
        {meals.map((meal, index) => (
          <li key={index}>
            <strong>{meal.name}</strong>: {meal.ingredients.join(", ")}
            <div className="nutrition-breakdown">
              <span>Calories: {meal.calories} kcal</span> |
              <span>Proteins: {meal.protein}g</span> |
              <span>Carbs: {meal.carbs}g</span> |
              <span>Fats: {meal.fats}g</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DietPlan;
