/*
  Author: Braden
  Description:
    Function to change user's information via form
  Related PBIs: nil
*/

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { Storage, Auth } from "aws-amplify";

import * as MdIcons from "react-icons/md";
import style from "./index.module.css";

function ProfileEdit(props) {
  const context = useContext(AuthContext);

  const [_Avatar, set_Avatar] = useState(undefined)
  const [formState, setformState] = useState({email: context.user.attributes.email, avatar: undefined})

  //goes through checks to see if form is proper
  async function submit() {
    const {email, avatar} = formState;


    if (avatar !== undefined) {
      // If size is over 2MB (size is in bytes)
      if (avatar.size > 2000000) {
        context.spawnNotification("ERROR", "Error", "Avatar too big! Max 2MB.");
        return;
      }

      // If not an image
      if (!avatar.type.startsWith("image/")) {
        context.spawnNotification("ERROR", "Error", "Avatar is not an image.");
        return;
      }

      // Success & Upload
      await Storage.put(context.user.attributes.sub + ".jpg", avatar);
      context.spawnNotification("SUCCESS", "Success", "Avatar successfully updated.");
    }

    if (email !== context.user.attributes.email) {
      // eslint-disable-next-line no-useless-escape
      const email_expression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (email_expression.test(email)) {
        await Auth.updateUserAttributes(context.user, {
          email: email
        }).then(async (result) => {
          if (result === "SUCCESS") {
            await Auth.currentAuthenticatedUser().then(async (result) => {
              await context.updateUser(result)
            });
            context.spawnNotification("SUCCESS", "Success", "Email updated, please confirm.");
            props.set_View("CONFIRM")
          }
        });
      } else {
        context.spawnNotification("ERROR", "Error", "Email not valid.");
      }
    }
  }

  useEffect(() => {
    async function get_avatar() {
      set_Avatar(await Storage.get(context.user.attributes.sub + ".jpg"))
    }
    get_avatar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error: "",
    }));
  }

  function onKeyPress(e) {
    if (e.key === "Enter") {
      submit()
    }
  }

  //used to change file
  async function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) {
      context.spawnNotification("ERROR", "Error", "File not valid.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      context.spawnNotification("ERROR", "Error", "File not an image.");
      return;
    }

    await setformState(() => ({...formState, avatar: file, error: ""}))

    try {
      let src = URL.createObjectURL(file);
      set_Avatar(src)
    } catch(error) {
      context.spawnNotification("ERROR", "Error", error.message);
    }
  }

  return (
    <div className={style.container} onKeyPress={onKeyPress} id="cypress-profileEdit">
      <div className={style.title}>
        <h2>Edit Profile</h2>
        <h5 className="subcomment">Edit your profile details below.</h5>
      </div>
      <hr/>
      <div className={style.avatar}>
        <img src={_Avatar} alt="Your avatar."/>
      </div>
      <div className={style.info}>
        {/* Email */}
        <label htmlFor="email"><MdIcons.MdMailOutline/> Email address</label>
        <input name="email" onChange={onChange} placeholder="Email address.." type="email" value={formState.email}/>

        {/* Avatar */}
        <label htmlFor="avatar"><MdIcons.MdPermIdentity/> Avatar</label>
        <input name="avatar" id="avatar" onChange={onFileChange} type="file"/>
      </div>
      <div className={style.actions}>
        <button onClick={submit}>Save changes</button>
        <br/>
        <u onClick={() => props.set_View("MAIN")} id="cypress-returnToProfile">Return to profile</u>
      </div>
    </div>
  )
}

export default ProfileEdit
