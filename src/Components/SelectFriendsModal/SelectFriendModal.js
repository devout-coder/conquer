import { Backdrop, Box, Fade, Modal, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import firebaseApp from "../../firebase";
import { loadingContext } from "../../loadingContext";
import SelectFriendModalEachFriend from "../SelectFriendModalEachFriend/SelectFriendModalEachFriend";

const SelectFriendModal = ({
  modalOpen,
  closeModal,
  taskUsers,
  setTaskUsers,
  taskOriginalUsers,
  taskRemovedUsers,
  setTaskRemovedUsers,
}) => {
  const user = useContext(loadingContext);

  let [userFriends, setUserFriends] = useState([]);
  let [friendsLoading, setFriendsLoading] = useState(true);

  const fetchFriendsDetails = (friends) => {
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
            setUserFriends(friendsDetails);
            setFriendsLoading(false);
          }
        });
    });
  };

  const fetchFriends = async () => {
    let mainUser = taskUsers[0];

    if (user.uid == mainUser) {
      let friends = (
        await firebaseApp.firestore().collection("friends").doc(user.uid).get()
      ).get("friends");
      taskUsers.forEach((user) => {
        if (!friends.includes(user) && user != mainUser) {
          friends.push(user);
        }
      });
      fetchFriendsDetails(friends);
    } else {
      let reqUsers = taskUsers.filter((eachUser) => eachUser != user.uid);
      fetchFriendsDetails(reqUsers);
    }
    setFriendsLoading(false);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#000000",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={modalOpen}
      onClose={closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className="friendsModal"
    >
      <Fade in={modalOpen}>
        <Box sx={style} className="selectFriendModal">
          {userFriends.map((friend, index) => (
            <SelectFriendModalEachFriend
              key={index}
              friend={friend}
              taskUsers={taskUsers}
              setTaskUsers={setTaskUsers}
              taskOriginalUsers={taskOriginalUsers}
              taskRemovedUsers={taskRemovedUsers}
              setTaskRemovedUsers={setTaskRemovedUsers}
            />
          ))}
          {taskUsers[0] != user.uid ? (
            <SelectFriendModalEachFriend
              friend={{
                friendId: user.uid,
                friendPhotoUrl: user.photoURL,
                friendName: "Me",
              }}
              taskUsers={taskUsers}
              setTaskUsers={setTaskUsers}
              taskOriginalUsers={taskOriginalUsers}
              taskRemovedUsers={taskRemovedUsers}
              setTaskRemovedUsers={setTaskRemovedUsers}
            />
          ) : (
            <></>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default SelectFriendModal;
