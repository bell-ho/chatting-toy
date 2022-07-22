import React, { useCallback } from 'react';
import Workspace from '@layouts/Workspace';
import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInputs from '@hooks/useInputs';

const DirectMessage = () => {
  const { workspace, id } = useParams();
  const [{ chat }, onChange, reset] = useInputs({ chat: '' });

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

  const {
    data: myData,
    error: myDataError,
    mutate: myDataMute,
  } = useSWR('/api/users', fetcher, { dedupingInterval: 2000 });

  const onSubmitForm = useCallback(() => {
    reset();
  }, []);

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
