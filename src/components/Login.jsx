import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import { AuthContext } from "../contexts/AuthContext";

import '../css/Login.css';

import * as MdIcons from "react-icons/md";
import PrivacyPolicy from './Agreements/PrivacyPolicy';
import Terms from './Agreements/Terms';


function FormLogin(props) {
  const initialForm = { username: "", password: "", error_message: ""};
  const [formState, setFormState] = useState(initialForm)

  async function process_login() {
    const { username, password } = formState;

    if (formState.username === "" || formState.password === "") {
      setFormState(() => ({
        ...formState,
        error_message: "Please fill in the required fields."
      }));
      return;
    }

    try {
      await Auth.signIn(username, password);
    } catch (error) {
      if (error.message) {
        setFormState(() => ({
          ...formState,
          error_message: error.message
        }));
      }
    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error_message: ""
    }));
  }

  return (
    <>
      <section className="form-top">
        <h1>Login</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
            </svg>
        </div>
      </section>
      <section className="form-bottom">
        {formState.error_message === "" ? <></> : <p className="error-text">{formState.error_message}</p>}

        <label htmlFor="username"><MdIcons.MdPermIdentity className="label-icon"/>Username</label>
        <input name="username" onChange={onChange} placeholder="Type your username"/>

        <label htmlFor="password"><MdIcons.MdLockOutline className="label-icon"/>Password</label>
        <input name="password" onChange={onChange} placeholder="Type your password" type="password"/>
        <button name="signin" onClick={process_login}>Sign in</button>
        <span name="registration_link" onClick={() => props.updateFormState("register")}>Don't have an account?</span>
      </section>
    </>
  )
}

function FormRegister(props) {
  const initialForm = { username: "", password: "", email: "", error_message: "",  confirm_terms: false, page: "default"};
  const [formState, setFormState] = useState(initialForm)

  async function process_register() {
    const { username, password, email } = formState;

    if (formState.username === "" || formState.password === "" || formState.email === "") {
      setFormState(() => ({
        ...formState,
        error_message: "Please fill in the required fields."
      }));
      return;
    }

    if (!formState.confirm_terms) {
      setFormState(() => ({
        ...formState,
        error_message: "You can't create an account without accepting our Terms & Conditions and Privacy Policy."
      }));
      return;
    }

    try {
      await Auth.signUp({username, password, attributes: { email }});
      props.updateFormState("confirm");
    } catch (error) {
      if (error.message) {
        setFormState(() => ({
          ...formState,
          error_message: error.message
        }));
      }
    }
  }

  function toggle_confirmation() {
    setFormState(() => ({
      ...formState,
      confirm_terms: !formState.confirm_terms,
      error_message: ""
    }));
  }

  function switch_page(desired_page) {
    setFormState(() => ({
      ...formState,
      page: desired_page,
      error_message: ""
    }));
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error_message: ""
    }));
  }

  return (
    <>
      <section className="form-top">
        <h1>Register</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
            </svg>
        </div>
      </section>
      <section className="form-bottom">
        { formState.page === "default" &&
          <>
            {formState.error_message === "" ? <></> : <p className="error-text">{formState.error_message}</p>}

            <label htmlFor="username"><MdIcons.MdPermIdentity className="label-icon"/>Username</label>
            <input value={formState.username} name="username" onChange={onChange} placeholder="Type your username"/>

            <label htmlFor="password"><MdIcons.MdLockOutline className="label-icon"/>Password</label>
            <input value={formState.password} name="password" onChange={onChange} placeholder="Type your password" type="password"/>

            <label htmlFor="email"><MdIcons.MdMailOutline className="label-icon"/>Email address</label>
            <input value={formState.email} name="email" onChange={onChange} placeholder="Type your email" type="email"/>

            {/* MdCheckBox */}
            <label htmlFor="terms"> { formState.confirm_terms ? <MdIcons.MdCheckBox onClick={toggle_confirmation} className="label-icon label-icon-check checked"/> : <MdIcons.MdCheckBoxOutlineBlank onClick={toggle_confirmation} className="label-icon label-icon-check"/>}<p>I confirm that i have read, consent and agree to Cryptalk's <span onClick={() => switch_page("terms")} className="span-link">Terms & Conditions</span> and <span onClick={() => switch_page("privacy")} className="span-link">Privacy Policy</span>.</p></label>

            <button onClick={process_register}>Sign up</button>
            <span onClick={() => props.updateFormState("login")}>Already have an account?</span>
          </>
        }
        { formState.page === "terms" &&
          <>
            <div className="readable-form">
              <Terms></Terms>
              <span className="span-link" onClick={() => switch_page("default")}><MdIcons.MdKeyboardArrowLeft/></span>
            </div>
          </>
        }
        { formState.page === "privacy" &&
          <>
            <div className="readable-form">
              <PrivacyPolicy></PrivacyPolicy>
              <span className="span-link" onClick={() => switch_page("default")}><MdIcons.MdKeyboardArrowLeft/></span>
            </div>
          </>
        }
      </section>
    </>
  )
}

function FormConfirm(props) {
  const initialForm = { username: "", authCode: ""};
  const [formState, setFormState] = useState(initialForm)

  async function process_confirm() {
    const { username, authCode } = formState;

    try {
      await Auth.confirmSignUp(username, authCode);
      props.updateFormState("login")
    } catch (error) {
      console.log(error)
    }
  }

  async function process_resend() {
    const { username } = formState;
    try {
      await Auth.resendSignUp(username);
    } catch (error) {
      console.log(error)
    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }
  return (
    <>
      <section className="form-top">
        <h1>Confirm</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
            </svg>
        </div>
      </section>
      <section className="form-bottom">
        <label htmlFor="username"><MdIcons.MdPermIdentity className="label-icon"/>Username</label>
        <input name="username" onChange={onChange} placeholder="Type your username"/>

        <label htmlFor="authCode"><MdIcons.MdLockOutline className="label-icon"/>Confirmation code has been sent to your email.</label>
        <input name="authCode" onChange={onChange} placeholder="Type your confirmation code"/>

        <button onClick={process_confirm}>Confirm</button>
        <span onClick={process_resend}>Resend confirmation code</span>
      </section>
    </>
  )
}

function Login() {
  const context = useContext(AuthContext);
  const [formState, updateFormState] = useState("login");

   async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      context.updateUser(user)
      updateFormState("redirect")
    } catch (error) {
      context.updateUser(null)
    }
  }

  async function setAuthListener() {
    Hub.listen("auth", (data) => {
      switch(data.payload.event) {
        case "signIn":
          checkUser()
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    checkUser();
    setAuthListener();

    return () => {
      Hub.remove("auth");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-container">
      <div className="login-form-container">
        { formState === "login" && <FormLogin updateFormState={updateFormState}/> }
        { formState === "register" && <FormRegister updateFormState={updateFormState}/> }
        { formState === "confirm" && <FormConfirm updateFormState={updateFormState}/> }
        { formState === "redirect" && <Redirect to="/" /> }
      </div>
    </div>
  )
}

export default Login
