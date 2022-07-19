import React, { useCallback } from 'react';
import { Button, Input, Label } from '@pages/SignUp/styles';
import Modal from '@components/Modal';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import useInputs from '@hooks/useInputs';
import axios from 'axios';
import { toast } from 'react-toastify';

const InviteChannelModal = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams();
  const { data: userData } = useSWR('/api/users', fetcher);
  const [{ newMember }, onChange, reset] = useInputs({ newMember: '' });

  const { mutate: revalidateMembers } = useSWR(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteChannel = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
          email: newMember,
        })
        .then((res) => {
          revalidateMembers(res.data, false);
          setShowInviteChannelModal(false);
          reset();
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteChannel}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" value={newMember} name="newMember" onChange={onChange} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
