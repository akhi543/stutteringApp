# Stuttering App
Course: CSE 5911, Capstone Project, Software Engineering<br>
The A Team: Akhilesh Gulati, Bharat Suri<br>
Course Instructor: Dr. Keith Shafer<br>
Project Sponsor: Dr. Christopher Bartlett<br>

#### Description
The Stuttering App was developed as part of the Capstone Project, CSE 5911 at The Ohio State University, Spring 2019. This project was motivated by the advances seen in speech therapy and how this process has alleviated the effect of stutter for many people.

This app aims to provide the accessibility of such speech exercises to its users who wish to practice in between therapy sessions as well as when they are away. Part of the motivation also comes from the active engagement that this whole therapy process needs and a mobile application is a way to further help the cause.


<hr>

#### Requirements
The project is developed in React Native. In order to run the app, install the following:
```
Install npm
Install expo
Install amplify
```
Run the commands:
```
npm install
amplify configure
amplify pull
```
The main task here is to configure all dependencies using npm installer, and then configuring AWS backend created for this app using amplify.

You may follow the default commands and install any dependency using npm that is not installed by the default command.

```npm install``` installs all dependencies in the package.json file.



<hr>

#### Getting Started
Clone the repository to your local machine. You may also choose to fork the repository or download the code as zip file to start developing.

In order to run the project, make sure that the amplify app is configured.
Add the Google console key in the code (screens/Login.js [48:9]) to use the Google sign-in service. That is used to get the basic user information.

After everything is configured, and StutteringApp is selected, run amplify pull command to fetch all cloud information about the project and setup the backend.

Once all the dependencies are installed, run the expo client using the command, ```expo start```

Using the expo client, the app will run on any Android device as long as the expo client is alive.

```
JS docstrings are present in each component
There is in-code documentation available
Docstrings are used to explain the behavior of the components
```

<hr>

### Using the App
#### Start and Login
> Open the app and press the Login button. This should take you to the Google Sign-in page. Here, you must select the Google account that has been pre-approved to be used with the app. Select that account, and the Access code screen should be shown. In case of an error, try again.
#### Access Code
> On the access code screen, you will be asked to enter the unique access code that will authenticate you to use the app. Enter that code and hit Sumbit.
#### Home Screen
> Once your access code is verfied, you will be automatically taken to the Home screen. The home of the app has three main things that you can do: Exercise, Social, and Profile
#### Exercise
> Press the Exercise tab on the botton tab navigator to go the Exercise page. Here you will see the list of exercises that are built in the app, such as Continuous speech, Light contact, Easy onset etc. Choose one that you wish to view or practice.
#### Practicing an Exercise
> When you choose an exercise from the list, you will be taken to that exercise. On this screen, you will see the description of that exercise as well as a video exemplar that further explains the exercise. Along with this information, you will also see a button to practice that exerise. Press that button to try the exercise.
#### Record screen
> When you press the practice button on any of the exercises, you will be taken to the record screen. Here, you will be able to record your audio while you try the exercise. The screen will prompt you to speak a word that a therapist would ask you in a session. After you stop the recording, you may play the recording to make sure that is okay, or else upload the recording if you think you want to submit. In case you wish to record again, press the record button again and it will start a new recording.
#### Profile
> Your profile shows some basic information about you. It also shows how many times you practiced a certain exercise. You may view your progress at any time. It also has a logout button in case you wish to logout and close the app.
#### Social
> The social tab is to view the progress shared by your peers to encourage you to practice more and get better at the speech exercises. You may choose to opt-in to view these posts and share your own progress too.