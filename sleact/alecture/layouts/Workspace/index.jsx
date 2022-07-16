import React, { useCallback, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';

const Workspace = ({ children }) => {
  const { data: userData, error, mutate } = useSWR('/api/users', fetcher, { dedupingInterval: 2000 });
  const navigate = useNavigate();
  const onLogout = useCallback(() => {
    axios
      .post(`/api/users/logout`, null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  useEffect(() => {
    if (!userData) {
      return navigate('/login');
    }
  }, [userData]);

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url('eeee', { s: '28px', d: 'retro' })} alt={'ewee'} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>채팅</WorkspaceName>
          <MenuScroll>
            {/*<Menu></Menu>*/}
            menuscroll
          </MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
      {/*{children}*/}
    </div>
  );
};

export default Workspace;
