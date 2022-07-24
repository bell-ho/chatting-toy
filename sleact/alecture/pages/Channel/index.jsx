import React, { useCallback } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';

const Channel = () => {
  const { workspace, id } = useParams();
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
  }, []);

  const { data: chatData, mutate: mutateChat } = useSWR(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${20}&page=${1}`,
    fetcher,
  );

  const {
    data: myData,
    error: myDataError,
    mutate: myDataMute,
  } = useSWR('/api/users', fetcher, { dedupingInterval: 2000 });

  return (
    <Container>
      <Header>채널</Header>
      {/*<ChatList chatData={chatData} />*/}
      {/*<ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />*/}
    </Container>
  );
};

export default Channel;
