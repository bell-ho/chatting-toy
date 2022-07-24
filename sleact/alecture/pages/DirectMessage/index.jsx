import React, { useCallback, useEffect, useRef } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import axios from 'axios';
import useInput from '@hooks/useInput';
import makeSection from '@utils/makeSection';
import useSWRInfinite from 'swr/infinite';
const DirectMessage = () => {
  const { workspace, id } = useParams();
  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef(null);

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${20}&page=${index + 1}`,
    fetcher,
  );

  const {
    data: myData,
    error: myDataError,
    mutate: myDataMute,
  } = useSWR('/api/users', fetcher, { dedupingInterval: 2000 });

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prev) => {
          prev?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prev;
        }, false).then(() => {
          setChat('');
          if (scrollbarRef.current) {
            scrollbarRef.current?.scrollToBottom(); //ui 최적화
          }
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, { content: chat })
          .then((res) => {
            // mutateChat(false, false);
            // mutateChat();
          })
          .catch(console.error);
      }
    },
    [chat, chatData, id, mutateChat, myData, setChat, userData, workspace],
  );
  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  //로딩 시 스크롤바 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData?.length, id]);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        scrollbarRef={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
