# BMR & Macro Calculator Feature

## 🧮 What It Does

The BMR Calculator helps you determine:
- **BMR (Basal Metabolic Rate)** - Calories your body burns at rest
- **TDEE (Total Daily Energy Expenditure)** - Calories you burn including activity
- **Target Calories** - Daily calorie goal based on your fitness goal
- **Macro Breakdown** - Recommended protein, carbs, and fat intake

## 📊 The Science Behind It

### Mifflin St. Jeor Equation

This calculator uses the **Mifflin St. Jeor equation**, considered the "gold standard" by nutritionists:

**For Men:**
```
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
```

**For Women:**
```
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
```

### Activity Level Multipliers

Your BMR is multiplied by your activity level:

| Activity Level | Multiplier | Description |
|----------------|------------|-------------|
| Sedentary | 1.2 | Little to no exercise |
| Lightly Active | 1.375 | Exercise 1-3 days/week |
| Moderately Active | 1.55 | Exercise 3-5 days/week |
| Very Active | 1.725 | Exercise 6-7 days/week |
| Extra Active | 1.9 | Intense daily exercise or physical job |

### Goal Adjustments

Based on your goal, calories are adjusted:

- **Lose Weight**: -500 calories/day (≈1 lb/week loss)
- **Maintain Weight**: No adjustment (maintain current weight)
- **Gain Weight**: +300 calories/day (lean muscle gain)

### Macro Distribution

**Protein:**
- Weight Loss: 2.2g per kg body weight (high protein preserves muscle)
- Weight Gain: 2.0g per kg body weight (muscle building)
- Maintenance: 1.8g per kg body weight (moderate)

**Fat:**
- 28% of total calories
- Essential for hormone production and nutrient absorption

**Carbs:**
- Remaining calories after protein and fat
- Primary energy source

## 🎯 How to Use

### Step 1: Enter Personal Information

1. **Age** - Your current age in years
2. **Gender** - Male or Female (affects BMR calculation)
3. **Height** - In centimeters (e.g., 175 cm)
4. **Weight** - In kilograms (e.g., 70 kg)

**Conversion helpers:**
- Feet to cm: `(feet × 12 + inches) × 2.54`
- Pounds to kg: `pounds × 0.453592`

### Step 2: Set Your Goals

**Goal Options:**
- **Lose Weight** - Creates 500 calorie deficit
- **Maintain Weight** - Matches your TDEE
- **Gain Weight** - Creates 300 calorie surplus

**Activity Level:**
Choose the option that best describes your weekly activity:
- Work out intensity
- Job activity level
- Daily movement

### Step 3: Calculate & Review Results

Click **"Calculate Macros"** to see:

1. **BMR** - Your baseline calorie burn
2. **TDEE** - Total calories including activity
3. **Target Calories** - Your daily calorie goal
4. **Macro Targets** - Protein, carbs, fat in grams

## 💡 Example Calculations

### Example 1: Weight Loss

**Profile:**
- Age: 30
- Gender: Male
- Height: 180 cm
- Weight: 90 kg
- Goal: Lose Weight
- Activity: Moderately Active

**Results:**
```
BMR: 1,970 calories
TDEE: 3,054 calories (1,970 × 1.55)
Target: 2,554 calories (3,054 - 500)

Protein: 198g (2.2 × 90)
Fat: 80g (28% of 2,554)
Carbs: 277g (remaining calories)
```

### Example 2: Muscle Gain

**Profile:**
- Age: 25
- Gender: Female
- Height: 165 cm
- Weight: 60 kg
- Goal: Gain Weight
- Activity: Very Active

**Results:**
```
BMR: 1,401 calories
TDEE: 2,417 calories (1,401 × 1.725)
Target: 2,717 calories (2,417 + 300)

Protein: 120g (2.0 × 60)
Fat: 85g (28% of 2,717)
Carbs: 379g (remaining calories)
```

## 🎨 Visual Features

### Color-Coded Macros

Each macro has a distinct color:
- 🟢 **Protein** - Green
- 🔵 **Carbs** - Blue
- 🔴 **Fat** - Red

### Progress Bars

Visual bars show the percentage of calories from each macro.

### Goal Icons

- 📉 **Lose Weight** - Red trending down arrow
- ➖ **Maintain** - Blue minus sign
- 📈 **Gain Weight** - Green trending up arrow

## 📝 Tips & Advice

### For Weight Loss

- ✅ High protein helps preserve muscle mass
- ✅ 500 calorie deficit = ~1 lb/week loss (safe rate)
- ✅ Track consistently for 2 weeks before adjusting
- ✅ Don't go below 1,200 cal/day (women) or 1,500 cal/day (men)

### For Muscle Gain

- ✅ Moderate surplus prevents excess fat gain
- ✅ Focus on strength training 4-5 days/week
- ✅ Ensure adequate protein at every meal
- ✅ Be patient - aim for 0.5-1 lb gain per week

### For Maintenance

- ✅ Match your TDEE as closely as possible
- ✅ Adjust if weight changes over 2-3 weeks
- ✅ Maintain balanced macro ratios
- ✅ Focus on whole, nutrient-dense foods

## 🔄 Integration with NutriTrack

### Compare Daily Intake vs Target

1. **Set your target** in BMR Calculator
2. **Track daily meals** in Calculator tab
3. **View totals** in sidebar
4. **Compare** actual vs target calories

### Example Workflow:

```
Morning:
1. Calculate BMR: Target = 2,500 calories
2. Note macro targets: 150g protein, 300g carbs, 75g fat

Throughout Day:
3. Add meals in Calculator tab
4. Check sidebar for running totals
5. Adjust remaining meals to hit targets

End of Day:
6. Sidebar shows: 2,480 calories (98% of target)
7. Sync to Google Calendar at midnight
```

## 🎓 Understanding the Results

### What is BMR?

Your **Basal Metabolic Rate** is the energy your body needs to:
- Keep your heart beating
- Maintain body temperature
- Power brain function
- Support organ function
- Breathe

Even if you stayed in bed all day, you'd burn your BMR in calories.

### What is TDEE?

Your **Total Daily Energy Expenditure** includes:
- BMR (60-75% of total)
- Physical activity (15-30%)
- Thermic effect of food (10%)
- Non-exercise activity (NEAT)

TDEE = What you need to eat to maintain weight

### Why Track Macros?

**Protein:**
- Builds and repairs muscle
- Increases satiety
- Higher thermic effect (burns more calories to digest)

**Carbs:**
- Primary energy source
- Fuels workouts
- Spares protein for muscle building

**Fat:**
- Essential for hormone production
- Needed for vitamin absorption (A, D, E, K)
- Provides sustained energy

## ⚙️ Customization Options

### Adjust Macro Ratios

The default ratios work for most people, but you can manually adjust:

**Higher Protein (Cutting):**
- Protein: 35-40%
- Carbs: 35-40%
- Fat: 20-25%

**Higher Carb (Bulking/Athletic):**
- Protein: 25-30%
- Carbs: 45-50%
- Fat: 25%

**Keto/Low Carb:**
- Protein: 25-30%
- Carbs: 5-10%
- Fat: 60-70%

### Activity Level Tips

**Be honest about activity:**
- Don't count walking around the house
- Count structured exercise only
- If between levels, start with lower one
- Adjust after 2 weeks if weight not changing as expected

## 📈 Tracking Progress

### Week 1-2: Baseline
- Track everything you eat
- Don't change habits yet
- See if you're hitting targets

### Week 3-4: Adjust
- If losing/gaining too fast: Adjust by 200-300 calories
- If no change but goal is weight change: Adjust activity level or calories

### Month 2+: Fine-tune
- Adjust macros based on performance
- Higher carbs if energy is low
- Higher protein if very hungry
- Adjust calories every 10 lbs of weight change

## 🚀 Quick Reference

| Goal | Calorie Adjustment | Protein | Weight Change Goal |
|------|-------------------|---------|-------------------|
| Lose Weight | -500 cal | 2.2g/kg | -1 lb/week |
| Maintain | No change | 1.8g/kg | 0 lb/week |
| Gain Weight | +300 cal | 2.0g/kg | +0.5 lb/week |

## 🔗 Helpful Resources

- [Bodybuilding.com Macro Calculator](https://www.bodybuilding.com/fun/macronutrients_calculator.htm)
- Research on Mifflin St. Jeor equation accuracy
- Macro tracking for beginners guide

---

**Ready to calculate your targets? Head to the BMR Calc tab!** 🎯
