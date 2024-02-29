require("dotenv").config();

const express = require("express");
const {
  analyzeGivenFood,
  createDietPlan,
  createDietPlanForBadFood,
} = require("../utils/ai.js");

const app = express();

app.get("/", async (req, res) => {
  const resForDiet = await createDietPlan(
    "I am 5'2 and I weight 82kg, I want lose fat and gain muscles. I am vegeterian and I do intense workouts "
  );

  const dietPlan = resForDiet.lc_kwargs.content;
  // Analyzing Food
  const resForAnalyze = await analyzeGivenFood("I ate cheesecake today.");
  const calorie = resForAnalyze.lc_kwargs.content;
  const resForBadFood = await createDietPlanForBadFood(
    `Current Diet: ${dietPlan} \n Food eaten today: ${calorie.foodEaten} \n Diet Preference: ${dietPlan.dietPreference}`
  );

  const dietPlanForBadFood = resForBadFood.lc_kwargs.content;

  res.json({
    dietPlan,
    calorie,
    dietPlanForBadFood,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;
