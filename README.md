boodmo - mobile app based on react-native.

Tech stack:
- react-native;
- redux;
- thunk;

IMPORTANT!

1. Clone;
2. Git checkout -b [task id] (ex. BOODMO-12002);
3. Make changes;
4. Pull;
5. Git push in your branch.
6. Make pull request with task description;
7. Wait for review;

How to build app for development:

For ios:
1. Buy macbook or smth else with macOS;
2. Clone project;
3. Install xcode (if you dont have it);
4. Cd in project folder and make npm i;
5. Cd in ios folder and make pod install + pod update;
6. Cd in root project folder and make react-native link;
7. React-native run-ios;

For android:
1. Java install and add it to $PATH variable;
2. Setup android environment (in bash profile);
3. Watchman install (it is optional, but not);
4. Android studio install + build tools setup + platforms setup (You must open android project -> wait for indexing -> tools -> android -> SDK manager);
5. Run android device emulator (You must open android project -> wait for indexing -> tools -> android -> AVD manager);
6. Clone project;
7. Cd in project folder and make npm i;
8. React-native run-android;

How to build app for production:
For ios:
1. Check CodePushDeploymentKey in Info.plist;
2. In Xcode product -> archive and upload to store ver X.X.X.XXXX (4.4.0.100) (STAGING);
3. Release boodmoIOS in staging using command "code-push release-react boodmoIOS ios";
4. Testing;
5. In Xcode product -> archive and upload to testflight ver X.X.X (4.4.0) (PRODUCTION);
6. Send production build to review;
7. Release boodmoIOS in production using command "code-push promote boodmoIOS"; (If there are some hot fixes)


For android:
1. Check reactNativeCodePush_androidDeploymentKey in strings.xml file;
2. Send build for testing ver X.X.X.XXXX (4.4.0.100) (STAGING);
3. Release boodmoAndroid in staging using command "code-push release-react boodmoAndroid android";
4. Testing;
5. Upload into google play market store build ver X.X.X.XXXX (4.4.0) (PRODUCTION);
6. Promote production build;
7. Release boodmoAndroid in production using command "code-push promote boodmoAndroid"; (If there are some hot fixes);

Mobile api documentation:
https://app.apiary.io/boodmo/editor
