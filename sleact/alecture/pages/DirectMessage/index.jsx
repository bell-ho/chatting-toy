import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, DragOver, Header } from '@pages/DirectMessage/styles';
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
import useSocket from '@hooks/useSocket';
import { toast } from 'react-toastify';

const DirectMessage = () => {
  const { workspace, id } = useParams();
  const [dragOver, setDragOver] = useState(false);
  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef(null);

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

  const [socket] = useSocket(workspace);

  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${20}&page=${index + 1}`,
    fetcher,
  );

  const { data: myData } = useSWR('/api/users', fetcher, { dedupingInterval: 2000 });

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
            mutateChat();
            // mutateChat(false, false);
          })
          .catch(console.error);
      }
    },
    [chat, chatData, id, mutateChat, myData, setChat, userData, workspace],
  );
  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  const onMessage = useCallback(
    (data) => {
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              scrollbarRef.current.scrollToBottom();
            } else {
              toast.success('새 메시지가 도착했습니다.', {
                onClick() {
                  scrollbarRef.current?.scrollToBottom();
                },
                closeOnClick: true,
              });
            }
          }
        });
      }
    },
    [id, mutateChat, myData],
  );

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, id, myData, onMessage]);

  //로딩 시 스크롤바 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData?.length, id]);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const formData = new FormData();
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
        setDragOver(false);
        mutateChat();
      });
    },
    [mutateChat, workspace, id],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
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
      {dragOver && <DragOver>업로드</DragOver>}
    </Container>
  );
};

export default DirectMessage;
