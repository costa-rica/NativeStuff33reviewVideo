import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviewReducerActionsArray: [],
  reviewReducerListOfPlayerDbObjects: [],
  isFavoriteToggle: false,
  reviewReducerVideoObject: null,
  //selectedActionObject: null, // New property to track user-selected action
  playbackMethod: "playVideo",
  playbackMethodPlayAllActionsSelectionActionObject: null,
};

// --- Elements of reviewActionsArray:
// actionsDbTableId: elem.id,
// reviewVideoActionsArrayIndex: elem.reviewVideoActionsArrayIndex,
// playerId: elem.playerId,
// timestamp: elem.timestampFromStartOfVideo,
// type: elem.type,
// subtype: elem.subtype,
// quality: elem.quality,
// isDisplayed: true,
// isFavorite: false,
// isPlaying: false,

// --- Elements of reviewReducerListOfPlayerDbObjects:
// "id
// firstName"
// lastName
// birthDate
// isDisplayed

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    // ------------- ReviewMatchSelection01 ------------------
    createReviewActionsArray: (state, action) => {
      state.reviewReducerActionsArray = action.payload;
    },

    createReviewActionsArrayUniquePlayersNamesAndObjects: (state, action) => {
      state.reviewReducerListOfPlayerDbObjects =
        action.payload.playerDbObjectsArray;
    },

    // ------------- ReviewVideo01 ------------------
    updateReviewReducerPlaybackMethod: (state, action) => {
      console.log(`- triggered change of playbackMethod: ${action.payload}`);
      state.playbackMethod = action.payload;
    },

    updateReviewReducerActionsArrayIsPlaying: (state, action) => {
      const playerCurrentTime = action.payload;
      let actionFound = false;
      let activeActionIndex = null;

      state.reviewReducerActionsArray = state.reviewReducerActionsArray.map(
        (action, index) => {
          const timeDifference = action.timestamp - playerCurrentTime;

          // Check if the action is within the 1.5 seconds range of the player currentTime (before or after)
          if (!actionFound && timeDifference <= 1.5 && timeDifference >= -1.5) {
            actionFound = true;
            activeActionIndex = index;
            return { ...action, isPlaying: true };
          }

          // If an action is found, determine if the subsequent action overlaps the current action's threshold
          if (activeActionIndex !== null && index > activeActionIndex) {
            const previousAction =
              state.reviewReducerActionsArray[activeActionIndex];
            const endOfPreviousAction = previousAction.timestamp + 1.5;

            if (action.timestamp <= endOfPreviousAction) {
              // If the next action starts within the previous action's threshold, it takes precedence
              activeActionIndex = index;
              return { ...action, isPlaying: true };
            }
          }

          return { ...action, isPlaying: false };
        }
      );
    },
    // updateReviewReducerActionsArrayIsPlayingOBE - does not keep isPLaying=true 1.5 seconds after: (state, action) => {
    //   const playerCurrentTime = action.payload;
    //   let actionFound = false;

    //   state.reviewReducerActionsArray = state.reviewReducerActionsArray.map(
    //     (action) => {
    //       if (actionFound || action.timestamp < playerCurrentTime) {
    //         return { ...action, isPlaying: false };
    //       }

    //       if (action.timestamp >= playerCurrentTime && !actionFound) {
    //         const timeDifference = action.timestamp - playerCurrentTime;
    //         if (timeDifference <= 1.5) {
    //           actionFound = true;
    //           return { ...action, isPlaying: true };
    //         }
    //       }

    //       return { ...action, isPlaying: false };
    //     }
    //   );
    // },
    pressedActionInReviewReducerActionArray: (state, action) => {
      state.selectedActionObject = action.payload;
      state.playbackMethod = "playOneAction";
      const updateActionIsPlaying = {
        ...action.payload,
        isPlaying: true,
      };

      // 🔹 UPDATE THE STATE
      state.reviewReducerActionsArray = state.reviewReducerActionsArray.map(
        (action) => ({
          ...action,
          isPlaying:
            action.isDisplayed &&
            action.reviewVideoActionsArrayIndex ===
              updateActionIsPlaying.reviewVideoActionsArrayIndex,
        })
      );
    },
    // updateReviewReducerActionsArrayIsPlayingForPlayAllActionsMethod: (
    //   state,
    //   action
    // ) => {
    //   const playerCurrentTime = action.payload;
    //   let nextActionIndex = null;

    //   // Find the next action whose timestamp is greater than the current time
    //   for (let i = 0; i < state.reviewReducerActionsArray.length; i++) {
    //     const action = state.reviewReducerActionsArray[i];
    //     if (action.timestamp >= playerCurrentTime) {
    //       nextActionIndex = i;
    //       break;
    //     }
    //   }

    //   if (nextActionIndex !== null) {
    //     state.reviewReducerActionsArray = state.reviewReducerActionsArray.map(
    //       (action, index) => ({
    //         ...action,
    //         isPlaying: index === nextActionIndex,
    //       })
    //     );
    //   }
    // },

    updatePlaybackMethodPlayAllActionsSelectionActionObjectOnCurrentTime: (
      state,
      action
    ) => {
      const currentTime = action.payload;
      state.playbackMethodPlayAllActionsSelectionActionObject =
        state.reviewReducerActionsArray.find(
          (action) => action.timestamp >= currentTime
        );

      state.reviewReducerActionsArray = state.reviewReducerActionsArray.map(
        (action) => ({
          ...action,
          isPlaying:
            action === state.playbackMethodPlayAllActionsSelectionActionObject,
        })
      );
    },

    // updatePlaybackMethodPlayAllActionsSelectionActionObjectOnCurrentTime: (
    //   state,
    //   action
    // ) => {
    //   const currentTime = action.payload;
    //   state.playbackMethodPlayAllActionsSelectionActionObject =
    //     state.reviewReducerActionsArray.find(
    //       (action) => action.timestamp >= currentTime
    //     );
    // },
    updatePlaybackMethodPlayAllActionsSelectionActionObjectOnNextIndex: (
      state
    ) => {
      const nextIndex =
        state.playbackMethodPlayAllActionsSelectionActionObject
          .reviewVideoActionsArrayIndex + 1;
      const nextAction = state.reviewReducerActionsArray.find(
        (action) => action.reviewVideoActionsArrayIndex === nextIndex
      );

      if (nextAction) {
        state.playbackMethodPlayAllActionsSelectionActionObject = nextAction;

        state.reviewReducerActionsArray = state.reviewReducerActionsArray.map(
          (action) => ({
            ...action,
            isPlaying: action === nextAction,
          })
        );
      }
    },

    // updatePlaybackMethodPlayAllActionsSelectionActionObjectOnNextIndex: (
    //   state
    // ) => {
    //   const nextIndex =
    //     state.playbackMethodPlayAllActionsSelectionActionObject
    //       .reviewVideoActionsArrayIndex + 1;
    //   state.playbackMethodPlayAllActionsSelectionActionObject =
    //     state.reviewReducerActionsArray.find(
    //       (action) => action.reviewVideoActionsArrayIndex === nextIndex
    //     );
    // },
  },
});

export const {
  createReviewActionsArray,
  createReviewActionsArrayUniquePlayersNamesAndObjects,
  updateReviewReducerPlaybackMethod,
  updateReviewReducerActionsArrayIsPlaying,
  pressedActionInReviewReducerActionArray,
  updateReviewReducerActionsArrayIsPlayingForPlayAllActionsMethod,
  updatePlaybackMethodPlayAllActionsSelectionActionObject,
  updatePlaybackMethodPlayAllActionsSelectionActionObjectOnCurrentTime,
  updatePlaybackMethodPlayAllActionsSelectionActionObjectOnNextIndex,
} = reviewSlice.actions;

export default reviewSlice.reducer;
