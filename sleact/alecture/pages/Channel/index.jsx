import React, { useCallback, useState } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import useInputs from '@hooks/useInputs';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';

const Channel = () => {
  const [{ chat }, onChange, reset] = useInputs({ chat: '' });
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    reset();
  }, []);
  return (
    <Container>
      <Header>채널</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChange} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
