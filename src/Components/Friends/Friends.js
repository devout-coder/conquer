import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Friends.css";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import EachFriend from "../EachFriend/EachFriend";
import firebaseApp from "../../firebase";
import { loadingContext } from "../../loadingContext";
import { RWebShare } from "react-web-share";
import { useLocation } from "react-router-dom";

const Friends = () => {
  let user = useContext(loadingContext);

  const [friendsLoading, setFriendsLoading] = useState(true);
  const [allFriends, setAllFriends] = useState([]);

  const location = useLocation(); //holds props
  const [friendConfirmModalVisible, setFriendConfirmModalVisible] =
    useState(false);
  const [friendId, setFriendId] = useState(null);
  const [friendName, setFriendName] = useState(null);

  const setFriendInfo = async () => {
    //wow what an amazing way for letting an asynchronous process happen
    if (user.uid != undefined) {
      let friendId = location.pathname.split("/")[2];
      if (friendId != undefined) {
        let doc = await firebaseApp
          .firestore()
          .collection("users")
          .doc(friendId)
          .get();
        // console.log(friendId);
        // console.log(user.uid);
        if (doc.get("userName") != undefined && friendId != user.uid) {
          setFriendId(friendId);
          setFriendName(doc.get("userName"));
          setFriendConfirmModalVisible(true);
        }
      }
    } else {
      setTimeout(setFriendInfo, 100);
    }
  };

  useEffect(() => {
    setFriendInfo();
  }, [user]);

  async function fetchAllFriendsUser() {
    firebaseApp
      .firestore()
      .collection("friends")
      .doc(user.uid)
      .onSnapshot((snap) => {
        // console.log(snap.get("friends"));
        if (snap.get("friends") != undefined) {
          let friends = snap.get("friends");
          let friendsDetails = [];
          friends.forEach((friendId) => {
            let obj = {};
            firebaseApp
              .firestore()
              .collection("users")
              .doc(friendId)
              .get()
              .then((doc) => {
                obj["friendId"] = friendId;
                obj["friendName"] = doc.get("userName");
                obj["friendPhotoUrl"] = doc.get("photoURL");
                friendsDetails.push(obj);
                if (friendsDetails.length == friends.length) {
                  setAllFriends(friendsDetails);
                  setFriendsLoading(false);
                }
              });
          });
        } else {
          setFriendsLoading(false);
        }
      });
  }

  useEffect(() => {
    if (user) {
      fetchAllFriendsUser();
    } else {
      setFriendsLoading(true);
    }
  }, [user]);

  const computeFriends = (oldFriends, friendId) => {
    let newFriends;

    if (oldFriends != undefined) {
      //doc in friends collection is present for this user
      if (oldFriends.includes(friendId)) {
        //the guy whose request you are trying to process is already your friend
        newFriends = oldFriends;
      } else {
        newFriends = [...oldFriends, friendId];
      }
    } else {
      //no doc in friends collection for this user
      newFriends = [friendId];
    }
    return newFriends;
  };

  const addFriend = async () => {
    let oldFriendsOfUser = (
      await firebaseApp.firestore().collection("friends").doc(user.uid).get()
    ).get("friends");
    let oldFriendsOfAllegedFriend = (
      await firebaseApp.firestore().collection("friends").doc(friendId).get()
    ).get("friends");

    let newFriendsOfUser = computeFriends(oldFriendsOfUser, friendId);
    let newFriendsOfAllegedFriend = computeFriends(
      oldFriendsOfAllegedFriend,
      user.uid
    );

    firebaseApp
      .firestore()
      .collection("friends")
      .doc(user.uid)
      .set({ friends: newFriendsOfUser });
    firebaseApp
      .firestore()
      .collection("friends")
      .doc(friendId)
      .set({ friends: newFriendsOfAllegedFriend });

    setFriendConfirmModalVisible(false);
  };

  return (
    <div className="friendsPage">
      <Navbar />
      <div className="friendsPageContent">
        <Dialog
          open={friendConfirmModalVisible}
          onClose={() => setFriendConfirmModalVisible(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {friendName} wants to be your friend. Once you accept this request
            you will be able to share tasks with this individual.
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => setFriendConfirmModalVisible(false)}
              color="primary"
            >
              <span className="confirmFriendModalText">
                No, sounds like a bad idea.
              </span>
            </Button>
            <Button onClick={addFriend} color="secondary">
              <span className="confirmFriendModalText">
                Yeah cool let's do it!
              </span>
            </Button>
          </DialogActions>
        </Dialog>
        <div className="friendsPageTop">
          <span className="addFriendsTagline">
            Add friends to create common tasks with them
          </span>
          <Button variant="text">
            <RWebShare
              data={{
                text: `Tap this link to accept ${user.displayName}'s Conquer friend request`,
                url: `https://conquer-goals.netlify.app/add-friend/${user.uid}`,
                title: "Friend Request",
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <span className="addFriendsButton">Share friendship link</span>
            </RWebShare>
          </Button>
          <div className="allFriends">
            {!friendsLoading ? (
              <div className="friendsContainer">
                {allFriends.length == 0 ? (
                  <span className="noFriendsText">No friends added yet!</span>
                ) : (
                  <span className="friendsText">Your friends</span>
                )}
                <div className="friendsList">
                  {allFriends.map((friend, index) => (
                    <EachFriend key={index} friend={friend} />
                  ))}
                </div>
              </div>
            ) : (
              <CircularProgress color="primary" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
