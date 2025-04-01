# NativeStuff33reviewVideo

![Kyber Vision Mobile Logo](./assets/images/kyberVisionLogo01.png)

## Description

Testing environment for the ReviewVideo playback component in the kyber-vision-mobile-13 project.

## Playback Methods Overview

This sandbox environment (`NativeStuff33reviewVideo`) is designed to isolate and test three playback methods for video review functionality. These methods are essential for the broader `kyber-vision-mobile-13` project and are being tested here to ensure compatibility and reliability within the same component (`ReviewVideo01`). The goal is to develop a flexible video playback system that responds to user interactions and backend data.

### What We're Doing (Laymen's Terms)

We are building a video playback system that allows users to interact with a video through three different playback methods. The video is divided into multiple **actions**, which are moments of interest marked with a timestamp. Users can:

- Play a single action (short clip).
- Automatically progress through all actions, one after the other.
- Play the video continuously without interruption.

### The Three Playback Methods

1. **Play Video (`playVideo`)**

   - This is the simplest playback method.
   - The video plays continuously from its current position until the end or until the user manually pauses it.
   - The `ReviewVideo01` component listens for the `player.currentTime` using a `useEventListener()` hook.
   - No interaction occurs with the `reviewReducer` beyond triggering the playback method.

2. **Play One Action (`playOneAction`)**

   - This method allows the user to select a single action from a list and play a 3-second clip centered around that action.
   - When an action is selected, the `pressedActionInReviewReducerActionArray()` function is triggered in the `reviewReducer`.
   - The playback begins **1.5 seconds before** the action's timestamp and stops **1.5 seconds after**.
   - If the playback exceeds the action's duration, it pauses automatically.
   - The `ReviewVideo01` component’s `playOneActionMethod()` handles this logic by monitoring the playback and updating the reducer accordingly.

3. **Play All Actions (`playAllActions`)**
   - This method is designed to automatically progress through all actions in the video.
   - The `updatePlaybackMethodPlayAllActionsSelectionActionObjectOnCurrentTime()` reducer function initializes the playback by finding the action immediately subsequent to the `player.currentTime`.
   - The `ReviewVideo01` component’s `playAllActionsMethod()` advances through the actions by playing 3-second clips for each.
   - After each action’s playback (3 seconds total), the next action is automatically selected and played.
   - If actions are closely spaced (less than 1.5 seconds apart), the video will backtrack to the correct start time for the next action.

### Interaction Between `ReviewVideo01` Component and `reviewReducer`

The `ReviewVideo01` component serves as the user interface for video playback. It interacts with the `reviewReducer` to manage state changes related to playback. Each playback method leverages different reducer functions to handle specific logic:

- `updateReviewReducerPlaybackMethod()`: Sets the active playback method.
- `pressedActionInReviewReducerActionArray()`: Updates the selected action for `playOneAction`.
- `updatePlaybackMethodPlayAllActionsSelectionActionObjectOnCurrentTime()`: Initializes playback for `playAllActions`.
- `updatePlaybackMethodPlayAllActionsSelectionActionObjectOnNextIndex()`: Advances to the next action during `playAllActions` playback.

The interaction between the `ReviewVideo01` component and the `reviewReducer` ensures that all playback methods can coexist and function properly within the same component. This sandbox is designed to confirm that the different playback methods are compatible and can be built to work seamlessly in the `kyber-vision-mobile-13` app.

## Environment Variables

- store in: .env.local

```env
EXPO_PUBLIC_API_URL=http://192.168.1.193:3000
```

## Installations

### 1. Navigation

```
yarn add @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```
