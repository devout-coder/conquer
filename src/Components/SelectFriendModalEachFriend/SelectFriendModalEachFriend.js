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

  return (
    <div className="eachFriend">
      <Button variant="text" onClick={checkUncheckfunc}>
        <Checkbox
          style={{ color: "#ffffff" }}
          checked={checked}
          // onChange={checkUncheckfunc}
        />
        {friend.friendPhotoUrl != null ? (
          <img className="eachFriendImage" src={friend.friendPhotoUrl} />
        ) : (
          <Avatar className="eachFriendImage" />
        )}
        {/* <Text style={styles.friendName}>{friend.friendName}</Text> */}
        <span className="eachFriendName">{friend.friendName}</span>
      </Button>
    </div>
  );
};

export default SelectFriendModalEachFriend;
