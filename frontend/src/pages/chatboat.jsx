import React, { useEffect } from "react";
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import $ from 'jquery';
// import '../../public/static/js/components/index'; // Assuming you need this file



const Container = () => {
    const handleSubmit = () => {
      // Handle submit logic here
    };
  
    useEffect(() => {
      // Bot pop-up intro
      const elemsTap = document.querySelector(".tap-target");
      if (elemsTap) {
        const instancesTap = M.TapTarget.init(elemsTap, {});
        instancesTap.open();
        setTimeout(() => {
          instancesTap.close();
        }, 4000);
      }
  
      // Initialization code
      $(document).ready(() => {
        // Bot pop-up intro
        $("div").removeClass("tap-target-origin");
  
        // Drop down menu for close, restart conversation & clear the chats.
        $(".dropdown-trigger").dropdown();
  
        // Initiate the modal for displaying the charts
        $(".modal").modal();
  
        // Enable this if you have configured the bot to start the conversation
        // showBotTyping();
        // $("#userInput").prop('disabled', true);
  
        // If you want the bot to start the conversation
        // customActionTrigger();
      });
  
      // Toggle the chatbot screen
      $("#profile_div").click(() => {
        $(".profile_div").toggle();
        $(".widget").toggle();
      });
  
      // Clear function to clear the chat contents of the widget
      $("#clear").click(() => {
        $(".chats").fadeOut("normal", () => {
          $(".chats").html("");
          $(".chats").fadeIn();
        });
      });
  
      // Close function to close the widget
      $("#close").click(() => {
        $(".profile_div").toggle();
        $(".widget").toggle();
        // Assuming scrollToBottomOfResults is defined elsewhere
        // if (typeof scrollToBottomOfResults === "function") {
        //   scrollToBottomOfResults();
        // }
      });
    }, []); // Empty dependency array ensures this effect runs only once after initial render
  
    return (
      <div className="container">
        {/* Modal for rendering the charts */}
        <div id="modal1" className="modal">
          <canvas id="modal-chart"></canvas>
        </div>
  
        {/* Chatbot widget */}
        <div className="widget">
          <div className="chat_header">
            {/* Add the name of the bot here */}
            <span className="chat_header_title">Chat Buddy</span>
            <span className="dropdown-trigger" href="#" data-target="dropdown1">
              <i className="material-icons"> more_vert </i>
            </span>
  
            {/* Dropdown menu*/}
            <ul id="dropdown1" className="dropdown-content">
              <li>
                <a href="#" id="clear">
                  Clear
                </a>
              </li>
              <li>
                <a href="#" id="restart">
                  Restart
                </a>
              </li>
              <li>
                <a href="#" id="close">
                  Close
                </a>
              </li>
            </ul>
          </div>
  
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {/* Chatbot contents */}
            <div className="chats" id="chats">
              <div className="clearfix"></div>
              <img
                className="botAvatar"
                src="./static/img/sara_avatar.png"
                alt="Bot Avatar"
              />
              <div className="botMsg">Hey!</div>
              <br />
              <br />
            </div>
          </div>
  
          {/* Keypad for user to type the message */}
          <div className="keypad">
            <textarea
              id="userInput"
              className="usrInput"
              placeholder="Type a message..."
              rows="1"
            ></textarea>
            <div id="sendButton" onClick={handleSubmit}>
              <i className="fa fa-paper-plane" aria-hidden="true"></i>
            </div>
          </div>
        </div>
  
        {/* Bot profile */}
        <div className="profile_div" id="profile_div">
          <img
            className="imgProfile"
            src="./static/img/botAvatar.png"
            alt="Bot Profile"
          />
        </div>
  
        {/* Bot pop-up intro */}
        <div className="tap-target" data-target="profile_div">
          <div className="tap-target-content">
            <h5 className="white-text">Hey there 👋</h5>
            <p className="white-text">I can help you get started with me.</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Container;
  