import React, { useCallback } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInputs from '@hooks/useInputs';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }) => {

  const [{ newChannel }, onChange, reset] = useInputs({ newChannel: '' });
  const { workspace, channel } = useParams();

  const { data: userData } = useSWR('/api/users', fetcher);
  const { mutate: revalidateChannel } = useSWR(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const onCreateChannel = useCallback((e) => {
    e.preventDefault();
    if (!newChannel || !newChannel.trim()) {
      return;
    }
    axios.post(`/api/workspaces/${workspace}/channels`, { name: newChannel })
      .then(() => {
        setShowCreateChannelModal(false);
        revalidateChannel();
        reset();
      })
      .catch((err) => {
        console.dir(err);
        toast.error(err.response?.data, { position: 'bottom-center' });
      });
  }, [newChannel]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id='channel-label'>
          <span>채널 이름</span>
          <Input id='channel' value={newChannel} name='newChannel' onChange={onChange} />
        </Label>
        <Button>생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
