import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';
const sockets = {};
const useSocket = (workspace) => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
    console.info('create socket', workspace, sockets[workspace]);
  }

  // sockets[workspace]?.emit('hello', 'world'); //emit으로 보내고
  // sockets[workspace]?.on('message', (data) => {
  //   //on으로 받고
  //   console.log(data);
  // });
  // sockets[workspace]?.on('data', (data) => {
  //   console.log(data);
  // });
  // sockets[workspace]?.on('onlineList', (data) => {
  //   console.log(data);
  // });

  return [sockets[workspace], disconnect];
};
export default useSocket;
