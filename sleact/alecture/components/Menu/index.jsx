import React, { useCallback } from 'react';
import { CloseModalButton, CreateMenu } from '@components/Menu/styles';

const Menu = ({ children, style, onCloseModal, show }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation(); //부모 이벤트 버블링 막기
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
