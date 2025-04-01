import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import ViewTemplate from "../screens_core/components/ViewTemplate";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEventListener } from "expo";
import {
  updateReviewReducerPlaybackMethod,
  updateReviewReducerActionsArrayIsPlaying,
  pressedActionInReviewReducerActionArray,
  updatePlaybackMethodPlayAllActionsSelectionActionObjectOnCurrentTime,
  updatePlaybackMethodPlayAllActionsSelectionActionObjectOnNextIndex,
} from "../reducers/review";
import ButtonKvImage from "./subcomponents/ButtonKvImage";
import { Image } from "react-native";

export default function ReviewVideo01({ route, navigation }) {
  const { videoSource } = route.params;
  const reviewReducer = useSelector((state) => state.review);
  const dispatch = useDispatch();
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  // Player Stuff
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.timeUpdateEventInterval = 0.1; // Update every 0.1 seconds for better precision
  });

  const reviewReducerActionsArray = useSelector(
    (state) => state.review.reviewReducerActionsArray
  );
  const setCurrentTimeManager = (timeToSet) => {
    player.currentTime = timeToSet;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={item.isPlaying ? styles.actionItemIsPlaying : styles.actionItem}
      onPress={() => {
        dispatch(pressedActionInReviewReducerActionArray(item));
        setCurrentTimeManager(item.timestamp - 1.5); // Jump to 1.5 seconds before the action
        player.play();
      }}
    >
      <Text style={styles.actionText}>
        Index: {item.reviewVideoActionsArrayIndex}
      </Text>
      <Text style={styles.actionText}>
        Timestamp:{" "}
        {`${Math.floor(item.timestamp / 60)}:${String(
          Math.floor(item.timestamp % 60)
        ).padStart(2, "0")}`}{" "}
        (seconds {item.timestamp})
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    player.play(); // Automatically start playing the video when the screen is displayed
  }, [player]);

  const playOneActionMethod = () => {
    const currentPlayingAction = reviewReducer.reviewReducerActionsArray.find(
      (action) => action.isPlaying
    );
    if (
      currentPlayingAction &&
      player.currentTime > currentPlayingAction.timestamp + 1.5
    ) {
      player.pause();
    }
  };
  // const playAllActionsMethod = () => {
  //   const actionsArray = reviewReducer.reviewReducerActionsArray;
  //   const currentPlayingActionIndex = actionsArray.findIndex(
  //     (action) => action.isPlaying
  //   );
  //   if (currentPlayingActionIndex !== -1) {
  //     const currentPlayingAction = actionsArray[currentPlayingActionIndex];
  //     const nextAction = actionsArray[currentPlayingActionIndex + 1];

  //     // Determine when the video should pause or jump to the next action
  //     const endOfCurrentAction = currentPlayingAction.timestamp + 1.5;

  //     if (player.currentTime > endOfCurrentAction) {
  //       if (nextAction) {
  //         const nextStartTime = nextAction.timestamp - 1.5;

  //         if (player.currentTime < nextStartTime) {
  //           player.currentTime = nextStartTime; // Jump to the next action's start
  //         }

  //         dispatch(
  //           updateReviewReducerActionsArrayIsPlayingForPlayAllActionsMethod(
  //             player.currentTime
  //           )
  //         );
  //       } else {
  //         player.pause(); // No more actions to play, stop the playback
  //       }
  //     }
  //   } else {
  //     // Start the playback from the first action if nothing is currently playing
  //     const firstAction = actionsArray[0];
  //     if (firstAction) {
  //       player.currentTime = firstAction.timestamp - 1.5;
  //       dispatch(
  //         updateReviewReducerActionsArrayIsPlayingForPlayAllActionsMethod(
  //           player.currentTime
  //         )
  //       );
  //       player.play();
  //     }
  //   }
  // };

  const playAllActionsMethod = () => {
    const currentPlayingAction =
      reviewReducer.playbackMethodPlayAllActionsSelectionActionObject;

    if (currentPlayingAction) {
      const actionStartTime = currentPlayingAction.timestamp - 1.5;
      const actionEndTime = currentPlayingAction.timestamp + 1.5;

      if (player.currentTime < actionStartTime) {
        player.currentTime = actionStartTime; // Jump to the action start
        player.play();
      } else if (player.currentTime > actionEndTime) {
        // Move to the next action
        dispatch(
          updatePlaybackMethodPlayAllActionsSelectionActionObjectOnNextIndex()
        );
        const nextAction =
          reviewReducer.playbackMethodPlayAllActionsSelectionActionObject;

        if (nextAction) {
          player.currentTime = nextAction.timestamp - 1.5;
          player.play();
        } else {
          player.pause(); // No more actions to play
        }
      }
    }
  };

  useEventListener(player, "timeUpdate", () => {
    setCurrentTimestamp(player.currentTime);
    switch (reviewReducer.playbackMethod) {
      case "playVideo":
        dispatch(updateReviewReducerActionsArrayIsPlaying(player.currentTime));
        break;
      case "playOneAction":
        playOneActionMethod();
        break;
      case "playAllActions":
        playAllActionsMethod();
        break;
      default:
        break;
    }
  });

  return (
    <ViewTemplate navigation={navigation}>
      <View style={styles.container}>
        <View style={{ position: "absolute", top: 0, left: 15, zIndex: 1 }}>
          <Text style={{ color: "white" }}>{reviewReducer.playbackMethod}</Text>
          <Text style={{ color: "white" }}>
            {`${Math.floor(currentTimestamp / 60)}:${String(
              Math.floor(currentTimestamp % 60)
            ).padStart(2, "0")}`}
          </Text>
          <Text style={{ color: "white" }}>
            {" "}
            Action Arr Index:{" "}
            {
              reviewReducer.reviewReducerActionsArray.find(
                (action) => action.isPlaying
              )?.reviewVideoActionsArrayIndex
            }
          </Text>
        </View>
        <View style={styles.vwContainerTop}>
          <ButtonKvImage
            onPress={() => {
              player.playing ? player.pause() : player.play();
              dispatch(updateReviewReducerPlaybackMethod("playVideo"));
            }}
            style={{ padding: 0 }}
          >
            <View style={styles.vwBtnPausePlay}>
              <Image
                source={
                  player.playing
                    ? require("../assets/images/btnPause.png")
                    : require("../assets/images/btnPlay.png")
                }
                alt="logo"
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
              />
            </View>
          </ButtonKvImage>
          <ButtonKvImage
            onPress={() => {
              console.log("play only actions");
              dispatch(
                updatePlaybackMethodPlayAllActionsSelectionActionObjectOnCurrentTime(
                  player.currentTime
                )
              );
              dispatch(updateReviewReducerPlaybackMethod("playAllActions"));
              player.play();
            }}
            style={{ padding: 0 }}
          >
            <Text style={{ color: "white" }}>Play All Actions</Text>
          </ButtonKvImage>
        </View>
        <VideoView style={styles.video} player={player} nativeControls={true} />
        <FlatList
          data={reviewReducerActionsArray}
          renderItem={renderItem}
          keyExtractor={(item) => item.reviewVideoActionsArrayIndex.toString()}
          style={styles.flatList}
        />
      </View>
    </ViewTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    // justifyContent: "center",
    alignItems: "flex-end",
  },
  vwContainerTop: {
    // backgroundColor: "blue",
    width: 100,
    height: 100,
    justifyContent: "space-around",
  },
  // title: {
  //   color: "white",
  //   fontSize: 18,
  //   marginBottom: 10,
  // },
  video: {
    width: "100%",
    height: "50%",
  },
  flatList: {
    width: "100%",
    backgroundColor: "#222",
    paddingTop: 10,
  },
  actionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  actionItemIsPlaying: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    backgroundColor: "green",
  },
  actionText: {
    color: "white",
  },
});
