import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { useContext, useState } from "react";
import firebaseApp from "../../firebase";
import avatarImage from "../../images/avatar.png";
import { loadingContext } from "../../loadingContext";
import "./EachFriend.css";

const EachFriend = ({ friend }) => {
  let user = useContext(loadingContext);
  
  const [deleteFriendModalVisible, setDeleteFriendModalVisible] =
    useState(false);

  const deleteFriend = async () => {
    setDeleteFriendModalVisible(false);
    let oldFriendsOfUser = (
      await firebaseApp.firestore().collection("friends").doc(user.uid).get()
    ).get("friends");
    let oldFriendsOfFriend = (
      await firebaseApp
        .firestore()
        .collection("friends")
        .doc(friend.friendId)
        .get()
    ).get("friends");
    let updatedFriendsOfUser = oldFriendsOfUser.filter((eachFriend) => {
      return eachFriend != friend.friendId;
    });
    let updatedFriendsOfFriend = oldFriendsOfFriend.filter((eachFriend) => {
      return eachFriend != user.uid;
    });
    firebaseApp
      .firestore()
      .collection("friends")
      .doc(user.uid)
      .set({ friends: updatedFriendsOfUser });
    firebaseApp
      .firestore()
      .collection("friends")
      .doc(friend.friendId)
      .set({ friends: updatedFriendsOfFriend });
  };

  return (
    <div className="eachFriend">
      <Dialog
        open={deleteFriendModalVisible}
        onClose={() => setDeleteFriendModalVisible(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Are you sure that you want to remove {friend.friendName} as your
          friend? You won't be able to share tasks with them.
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setDeleteFriendModalVisible(false)}
            color="primary"
          >
            <span className="deleteFriendModalText">No, take me back</span>
          </Button>
          <Button onClick={deleteFriend} color="secondary">
            <span className="deleteFriendModalText">Yeah I wanna do that</span>
          </Button>
        </DialogActions>
      </Dialog>
      {friend.friendPhotoUrl != null ? (
        <img className="friendPhoto" src={friend.friendPhotoUrl} />
      ) : (
        <img className="friendPhoto" src={avatarImage} />
      )}
      <div className="friendInfo">
        <span className="friendName">{friend.friendName}</span>
      </div>
      <IconButton
        className="friendRemove"
        onClick={() => setDeleteFriendModalVisible(true)}
      >
        <Delete color="secondary" />
      </IconButton>
    </div>
  );
};

export default EachFriend;
