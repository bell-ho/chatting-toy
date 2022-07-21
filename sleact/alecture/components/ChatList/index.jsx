import React from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';

const ChatList = () => {
  return (
    <ChatZone>
      {/*<Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>*/}
      {/*  {Object.entries(chatSections).map(([date, chats]) => {*/}
      {/*    return (*/}
      {/*      <Section className={`section-${date}`} key={date}>*/}
      {/*        <StickyHeader>*/}
      {/*          <button>{date}</button>*/}
      {/*        </StickyHeader>*/}
      {/*        {chats.map((chat) => (*/}
      {/*          <Chat key={chat.id} data={chat} />*/}
      {/*        ))}*/}
      {/*      </Section>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</Scrollbars>*/}
      <Section>section</Section>
    </ChatZone>
  );
};

export default ChatList;
