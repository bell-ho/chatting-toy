import React, { useCallback, useRef } from 'react';
import { ChatZone } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';

const ChatList = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
