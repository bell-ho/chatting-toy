import React, { useCallback } from 'react';
import { Button, Input, Label } from '@pages/SignUp/styles';
import Modal from '@components/Modal';
import useInputs from '@hooks/useInputs';
import axios from 'axios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';

const InviteWorkspaceModal = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const [{ newMember }, onChange, reset] = useInputs({ newMember: '' });
  const { workspace, channel } = useParams();
  const { data: userData } = useSWR('/api/users', fetcher);
  const { mutate: revalidateMember } = useSWR(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }

      axios
        .post(`/api/workspaces/${workspace}/members`, { email: newMember })
        .then((res) => {
          setShowInviteWorkspaceModal(false);
          revalidateMember(res.data, false);
          reset();
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} name="newMember" onChange={onChange} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
