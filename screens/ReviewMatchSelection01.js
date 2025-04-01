import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ViewTemplate from "../screens_core/components/ViewTemplate";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  createReviewActionsArray,
  createReviewActionsArrayUniquePlayersNamesAndObjects,
} from "../reducers/review";
import { useSelector } from "react-redux";

export default function ReviewMatchSelection01({ navigation }) {
  const [videosList, setVideosList] = useState([]);
  const dispatch = useDispatch();
  const reviewReducer = useSelector((state) => state.review);
  const fetchVideoListApiCall = async () => {
    console.log(`API URL: ${process.env.EXPO_PUBLIC_API_URL}/videos`);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/videos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }

      const resJson = await response.json();
      const videosObjArray = resJson.videos.map((elem) => ({
        id: `${elem.id}`,
        name: elem.match ? elem.match.matchName : "Unknown Match",
        matchName: elem.match ? elem.match.matchName : "Unknown Match",
        apiDownloadUrl: elem.url,
        matchId: elem.match ? elem.match.id : null,
      }));

      setVideosList(videosObjArray);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideoListApiCall();
  }, []);

  // Render function for FlatList
  const renderVideoItem = async ({ item }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={async () => {
        await fetchActionsForMatch(item.matchId);
        navigation.navigate("ReviewVideo01", {
          // videoSource: { uri: item.apiDownloadUrl },
          videoSource: {
            uri: `${process.env.EXPO_PUBLIC_API_URL}/videos/stream-only/${item.id}`,
            headers: {
              Range: "bytes=0-8388608", // Request only 8MB initially
              // Authorization: `Bearer ${userReducer.token}`,
            },
          },
          matchName: item.matchName,
        });
      }}
    >
      <Text style={styles.videoText}>Match: {JSON.stringify(item)}</Text>
    </TouchableOpacity>
  );

  // fetch Actions for Match
  const fetchActionsForMatch = async (matchId) => {
    console.log("in fetchActionsForMatch for matchId: ", matchId);
    try {
      console.log(`Fetching actions for match: ${matchId}`);
      console.log(
        `${process.env.EXPO_PUBLIC_API_URL}/matches/${matchId}/actions`
      );
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/matches/${matchId}/actions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${userReducer.token}`,
          },
        }
      );
      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }
      let resJson = null;
      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes("application/json")) {
        resJson = await response.json();
      }
      // console.log(resJson);
      let tempCleanActionsArray = [];
      for (const elem of resJson.actionsArray) {
        // console.log(elem.id);
        tempCleanActionsArray.push({
          actionsDbTableId: elem.id,
          reviewVideoActionsArrayIndex: elem.reviewVideoActionsArrayIndex,
          playerId: elem.playerId,
          timestamp: elem.timestampFromStartOfVideo,
          type: elem.type,
          subtype: elem.subtype,
          quality: elem.quality,
          isDisplayed: true,
          isFavorite: false,
          isPlaying: false,
        });
      }

      dispatch(createReviewActionsArray(tempCleanActionsArray));

      let tempPlayerDbObjectsArray = [];
      // console.log(
      //   `playerDbObjectsArray: ${JSON.stringify(resJson.playerDbObjectsArray)}`
      // );
      for (const elem of resJson.playerDbObjectsArray) {
        tempPlayerDbObjectsArray.push({
          ...elem,
          isDisplayed: true,
        });
      }
      dispatch(
        createReviewActionsArrayUniquePlayersNamesAndObjects({
          // playerNamesArray: resJson.playerNamesArray,
          playerDbObjectsArray: tempPlayerDbObjectsArray,
        })
      );
    } catch (error) {
      console.error("Error fetching actions for match:", error);
    }
  };

  return (
    <ViewTemplate navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.title}>Available Videos</Text>
        <FlatList
          data={videosList}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ViewTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  videoItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  videoText: {
    fontSize: 16,
    color: "black",
  },
});

// import { StyleSheet, Text, View } from "react-native";
// import ViewTemplate from "../screens_core/components/ViewTemplate";
// import { useDispatch } from "react-redux";
// import { createReviewActionsArray } from "../reducers/review";
// import { createReviewActionsArrayUniquePlayersNamesAndObjects } from "../reducers/review";

// export default function ReviewMatchSelection01({ navigation }) {
//   const fetchVideoListApiCall = async () => {
//     console.log(`API URL: ${process.env.EXPO_PUBLIC_API_URL}/videos`);

//     try {
//       // const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos`);
//       const response = await fetch(
//         `${process.env.EXPO_PUBLIC_API_URL}/videos`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Bearer ${userReducer.token}`,
//           },
//         }
//       );
//       if (response.status !== 200) {
//         console.log(`There was a server error: ${response.status}`);
//         return;
//       }

//       const resJson = await response.json();

//       const statuses = {};
//       for (const elem of resJson.videos) {
//         console.log(`checking for: ${elem.filename}`);
//         const fileUri = `${FileSystem.cacheDirectory}${elem.filename}`; // 🔁 use cacheDirectory here too
//         const fileInfo = await FileSystem.getInfoAsync(fileUri);
//         statuses[elem.filename] = fileInfo.exists;

//         console.log(`this file exists: ${fileInfo.exists}`);
//       }

//       // Map API response to videosList with `matchDate` included
//       const videosObjArray = resJson.videos.map((elem) => {
//         console.log(
//           `creating object for id: ${elem.id} filename: ${elem.filename}`
//         );

//         return {
//           id: `${elem.id}`,
//           name: elem.match ? elem.match.matchName : "Unknown Match",
//           date: elem.match ? elem.match.matchDate : null, // Ensure matchDate is included
//           match: elem.match || {}, // Ensure `match` is always an object
//           matchName: elem.match ? elem.match.matchName : "Unknown Match",
//           scripted: false,
//           downloaded: statuses[elem.filename] || false,
//           apiDownloadUrl: elem.url,
//           durationOfMatch: elem.durationString,
//           filename: elem.filename,
//           setTimeStampsArray: elem.setTimeStampsArray,
//           videoFileSizeInMb: elem.videoFileSizeInMb,
//         };
//       });
//       console.log(videosObjArray);
//       console.log("apiDownload url 🤔 ");
//       setVideosList(videosObjArray);
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };

//   const videoIsDownloadedGoToReviewVideo = async (elem) => {
//     // 1.2 get video details in the reviewReducer
//     dispatch(updateReviewReducerVideoObject(elem));

//     // 3. Get the actions for the match
//     await fetchActionsForMatch(elem.match.id);

//     // 4. Go to ReviewVideo screen
//     console.log("go to ReviewVideo screen ...");
//     navigation.navigate("ReviewVideo", {
//       matchName: elem.matchName,
//       // videoUri: `${FileSystem.documentDirectory}${elem.filename}`,
//       // videoUri: `${FileSystem.cacheDirectory}${elem.filename}`, // 🔁 use cacheDirectory here too
//       videoSource: {
//         uri: `${process.env.EXPO_PUBLIC_API_URL}/videos/stream-only/${elem.id}`,
//         headers: {
//           Range: "bytes=0-8388608", // Request only 8MB initially
//           Authorization: `Bearer ${userReducer.token}`,
//         },
//       },
//     });
//   };

//   // fetch Actions for Match
//   const fetchActionsForMatch = async (matchId) => {
//     console.log("in fetchActionsForMatch for matchId: ", matchId);
//     try {
//       console.log(`Fetching actions for match: ${matchId}`);
//       console.log(
//         `${process.env.EXPO_PUBLIC_API_URL}/matches/${matchId}/actions`
//       );
//       const response = await fetch(
//         `${process.env.EXPO_PUBLIC_API_URL}/matches/${matchId}/actions`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Bearer ${userReducer.token}`,
//           },
//         }
//       );
//       if (response.status !== 200) {
//         console.log(`There was a server error: ${response.status}`);
//         return;
//       }
//       let resJson = null;
//       const contentType = response.headers.get("Content-Type");

//       if (contentType?.includes("application/json")) {
//         resJson = await response.json();
//       }
//       // console.log(resJson);
//       let tempCleanActionsArray = [];
//       for (const elem of resJson.actionsArray) {
//         // console.log(elem.id);
//         tempCleanActionsArray.push({
//           actionsDbTableId: elem.id,
//           reviewVideoActionsArrayIndex: elem.reviewVideoActionsArrayIndex,
//           playerId: elem.playerId,
//           timestamp: elem.timestampFromStartOfVideo,
//           type: elem.type,
//           subtype: elem.subtype,
//           quality: elem.quality,
//           isDisplayed: true,
//           isFavorite: false,
//           isPlaying: false,
//         });
//       }

//       dispatch(createReviewActionsArray(tempCleanActionsArray));

//       let tempPlayerDbObjectsArray = [];
//       // console.log(
//       //   `playerDbObjectsArray: ${JSON.stringify(resJson.playerDbObjectsArray)}`
//       // );
//       for (const elem of resJson.playerDbObjectsArray) {
//         tempPlayerDbObjectsArray.push({
//           ...elem,
//           isDisplayed: true,
//         });
//       }
//       dispatch(
//         createReviewActionsArrayUniquePlayersNamesAndObjects({
//           // playerNamesArray: resJson.playerNamesArray,
//           playerDbObjectsArray: tempPlayerDbObjectsArray,
//         })
//       );
//     } catch (error) {
//       console.error("Error fetching actions for match:", error);
//     }
//   };

//   return (
//     <ViewTemplate navigation={navigation}>
//       <View style={styles.container}>
//         <Text>Review Match Selection</Text>
//         {/* FlatList of videos goes here each should be a button to advance to the ReviewVideo screen */}
//       </View>
//     </ViewTemplate>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "gray",
//     justifyContent: "center",
//     padding: 10,
//   },
// });
