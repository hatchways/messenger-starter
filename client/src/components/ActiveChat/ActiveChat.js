import React, { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
}));

const ActiveChat = ({
  user,
  conversations,
  activeConversation,
  postMessage,
  setConversations,
}) => {
  const classes = useStyles();

  const conversation = conversations
    ? conversations.find(
        (conversation) => conversation.otherUser.username === activeConversation
      )
    : {};

  const isConversation = (obj) => {
    return obj !== {} && obj !== undefined;
  };

  useEffect(() => {
    const seeMessages = async () => {
      const { data } = await axios.post("/api/messages/read", {
        conversationId: conversation?.id,
      });
      // console.log(data);
    };

    const fetchConversations = async () => {
      try {
        const { data } = await axios.get("/api/conversations");
        setConversations(data);
      } catch (error) {
        console.error(error);
      }
    };

    // update messages.seen to be true here
    // send conversation id to /read

    if (!!conversation) {
      seeMessages();

      if (!user.isFetching) {
        fetchConversations();
      }
    }
  }, [activeConversation, setConversations, user]);

  return (
    <Box className={classes.root}>
      {isConversation(conversation) && conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            {user && (
              <>
                <Messages
                  messages={conversation.messages}
                  otherUser={conversation.otherUser}
                  userId={user.id}
                />
                <Input
                  otherUser={conversation.otherUser}
                  conversationId={conversation.id || null}
                  user={user}
                  postMessage={postMessage}
                />
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
