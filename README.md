NutriTrack: Photography & Nutrition Calculator
NutriTrack is a streamlined utility designed to help users track their daily nutritional intake through a combination of visual logging and manual calculation. By integrating camera functionality with a precise macro calculator, it provides a centralized hub for monitoring dietary goals.

App Walkthrough
Below is a demonstration of the NutriTrack interface, covering the camera permission flow, manual macro entry, and the Google Calendar configuration UI.

<video src="https://github.com/ludiusvox/nutritrack/raw/master/Screen%20recording%202026-03-22%204.26.04%20AM.webm" width="100%" controls>
  Your browser does not support the video tag.
</video>

Key Features
Camera Integration: Capture photos of meals directly within the app to maintain a visual food diary.

Nutrition Calculator: Input specific macronutrients (Fat, Carbs, Protein) to automatically calculate total calories for any food item.

Daily Summary: View a real-time breakdown of your daily caloric and macronutrient totals.

Google Calendar Sync (Beta): Includes an integration framework to sync daily nutrition totals with your Google Calendar.

Getting Started
1. Installation
Install the provided APK on your Android device. Ensure that you allow the necessary permissions for camera access when prompted to enable the photography features.

2. Calculating Your Needs
Before logging data, it is important to know your target numbers. This app acts as a ledger, but for personalized targets, it is recommended to use an external professional resource:

Visit the Bodybuilding.com Nutrition Center to use their macronutrient calculator.

Determine your daily Fat, Carbohydrate, and Protein goals based on your specific fitness objectives (e.g., strength training or powerbuilding).

3. Google Calendar Configuration
The "Calendar" tab allows you to connect the app to the Google Cloud Console.

Note on Implementation: The Google Calendar integration is currently a secondary feature. It has not yet been fully tested for all environments and is not a requirement for the author's own implementation or core usage. You can use the full suite of tracking tools without ever signing into Google.

Technical Setup (Optional)
If you wish to test the Calendar integration, you will need:

A Project in the Google Cloud Console.

An OAuth 2.0 Client ID and API Key.

The Redirect URI set to http://localhost:5173.

Usage Tips
Manual Entries: If you know the macros for a "Glass of Milk," enter them in the Calculator tab and hit Add Entry to update your Daily Summary immediately.

Scannability: Use the side drawer to quickly check your progress against your daily limits.


  This is a code bundle for Photography and Nutrition App. The original project is available at https://www.figma.com/design/b3PppgUzwKEvjb3KSwQTYS/Photography-and-Nutrition-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
