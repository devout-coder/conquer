import React, { useContext, useState } from "react";
import { loadingContext } from "../../loadingContext";
import { Button, Checkbox } from "@material-ui/core";
import "./SelectFriendModalEachFriend.css";
import Avatar from "@material-ui/core/Avatar";

const SelectFriendModalEachFriend = ({
  friend,
  taskUsers,
  setTaskUsers,
  taskOriginalUsers,
  taskRemovedUsers,
  setTaskRemovedUsers,
}) => {
  let user = useContext(loadingContext);

  const [checked, setChecked] = useState(
    taskUsers.includes(friend.friendId) ? true : false
  );

  const checkUncheckfunc = () => {
    if (!checked) {
      setTaskUsers([...taskUsers, friend.friendId]);
      if (taskRemovedUsers.includes(friend.friendId)) {
        setTaskRemovedUsers(
          taskRemovedUsers.filter((eachUser) => eachUser != friend.friendId)
        );
      }
    } else {
      setTaskUsers(taskUsers.filter((item) => item !== friend.friendId));
      if (taskOriginalUsers.includes(friend.friendId)) {
        setTaskRemovedUsers([...taskRemovedUsers, friend.friendId]);
      }
    }
    setChecked(!checked);
  };

  return user.uid == taskUsers[0] ? (
    <div className="eachFriend">
      <Button variant="text" onClick={checkUncheckfunc}>
        <Checkbox
          style={{ color: "#ffffff" }}
          checked={checked}
          className="friendBoxChecked"
        />
        {friend.friendPhotoUrl != null ? (
          <img className="eachFriendImage" src={friend.friendPhotoUrl} />
        ) : (
          <Avatar className="eachFriendImage" />
        )}
        <span className="eachFriendName">{friend.friendName}</span>
      </Button>
    </div>
  ) : (
    <div className="eachFriend">
      <Button
        variant="text"
        onClick={friend.friendId == user.uid ? checkUncheckfunc : null}
        disabled={friend.friendId == user.uid ? false : true}
      >
        {friend.friendId == user.uid ? (
          <Checkbox
            style={{ color: "#ffffff" }}
            checked={checked}
            className="friendBoxChecked"
          />
        ) : (
          <div className="friendBoxChecked"></div>
        )}
        {friend.friendPhotoUrl != null ? (
          <img
            className={
              friend.friendId == user.uid
                ? "eachFriendImage"
                : "eachFriendImageSpace"
            }
            src={friend.friendPhotoUrl}
          />
        ) : (
          <Avatar
            className={
              friend.friendId == user.uid
                ? "eachFriendImage"
                : "eachFriendImageSpace"
            }
          />
        )}
        {/* <Text style={styles.friendName}>{friend.friendName}</Text> */}
        <span className="eachFriendName">{friend.friendName}</span>
        {friend.friendId == taskUsers[0] ? (
          <span className="ownerText">Owner</span>
        ) : (
          <></>
        )}
      </Button>
    </div>
  );
};

export default SelectFriendModalEachFriend;
