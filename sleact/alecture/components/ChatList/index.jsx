import React, { useCallback } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';

const ChatList = ({ chatSections, setSize, isEmpty, isReachingEnd, scrollbarRef }) => {
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
        setSize((prev) => prev + 1).then(() => {
          if (scrollbarRef?.current) {
            scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [isEmpty, isReachingEnd, scrollbarRef, setSize],
  );

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats?.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
