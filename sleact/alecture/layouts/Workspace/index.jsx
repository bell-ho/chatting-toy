import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { NavLink, Route, useNavigate } from 'react-router-dom';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import { Routes, useParams } from 'react-router';
import Channel from '@pages/Channel';
import DirectMessage from '@pages/DirectMessage';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInputs from '@hooks/useInputs';
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import useSocket from '@hooks/useSocket';

const Workspace = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);

  const [{ newWorkspace, newUrl }, onChange, reset] = useInputs({
    newWorkspace: '',
    newUrl: '',
  });

  const { workspace, channel } = useParams();

  const { data: userData, mutate: userDataMute } = useSWR('/api/users', fetcher, { dedupingInterval: 2000 });
  const { data: channelData } = useSWR(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && userData && socket) {
      socket?.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
    }
  }, [socket, channelData, userData]);

  //연결 끊을때 : 워크스페이스 바뀔때
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect, workspace]);

  const navigate = useNavigate();
  const onLogout = useCallback(() => {
    axios
      .post(`/api/users/logout`, null, {
        withCredentials: true,
      })
      .then(() => {
        userDataMute(false, false);
      });
  }, [userDataMute]);

  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      const params = { workspace: newWorkspace, url: newUrl };
      axios
        .post(`/api/workspaces`, params, { withCredentials: true })
        .then((res) => {
          userDataMute(false, false);
          setShowCreateWorkspaceModal(false);
          reset();
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl, userDataMute, reset],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal((prev) => false);
    setShowCreateChannelModal((prev) => false);
    setShowInviteWorkspaceModal((prev) => false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  // 리턴하는 함수는 맨아래에해야 에러 안남
  useEffect(() => {
    if (!userData) {
      return navigate('/login');
    }
  }, [navigate, userData]);

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData?.email, { s: '28px', d: 'retro' })} alt={userData?.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData?.email, { s: '36px', d: 'retro' })} alt={userData?.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((workspace) => {
            return (
              <NavLink key={workspace.id} to={`/workspace/${workspace.url}/channel/일반`}>
                <WorkspaceButton>{workspace.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </NavLink>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>sl</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>채팅</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" name="newWorkspace" value={newWorkspace} onChange={onChange} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" name="newUrl" value={newUrl} onChange={onChange} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>

      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />

      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
    </div>
  );
};

export default Workspace;
