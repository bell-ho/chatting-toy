import React, { useCallback } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInputs from '@hooks/useInputs';
import axios from 'axios';

const DirectMessage = () => {
  const { workspace, id } = useParams();
  const [{ chat }, onChange, reset] = useInputs({ chat: '' });

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

  const { data: chatData, mutate: mutateChat } = useSWR(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${20}&page=${1}`,
    fetcher,
  );

  const {
    data: myData,
    error: myDataError,
    mutate: myDataMute,
  } = useSWR('/api/users', fetcher, { dedupingInterval: 2000 });

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, { content: chat })
          .then(() => {
            mutateChat(false, false);
            reset();
          })
          .catch(console.error);
      }
    },
    [chat],
  );

  if (!userData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChange} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
