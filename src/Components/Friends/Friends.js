import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Friends.css";
import { Button, CircularProgress } from "@material-ui/core";
import EachFriend from "../EachFriend/EachFriend";
import firebaseApp from "../../firebase";
import { loadingContext } from "../../loadingContext";
import { RWebShare } from "react-web-share";

const Friends = () => {
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [allFriends, setAllFriends] = useState([]);
  let user = useContext(loadingContext);

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

  return (
    <div className="friendsPage">
      <Navbar />
      <div className="friendsPageContent">
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
