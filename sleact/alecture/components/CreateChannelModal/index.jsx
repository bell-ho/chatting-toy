import React, { useCallback } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInputs from '@hooks/useInputs';

const CreateChannelModal = ({show,onCloseModal, setShowCreateChannelModal}) => {

  const [{newChannel},onChange,reset] = useInputs({ newChannel: ''})

  const onCreateChannel= useCallback(()=>{
    reset();
  },[])

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널 이름</span>
          <Input id="channel" value={newChannel} name="newChannel" onChange={onChange} />
        </Label>
        <Button>생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
