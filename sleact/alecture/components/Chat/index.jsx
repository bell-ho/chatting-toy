import React, { useMemo } from 'react';
import { ChatWrapper } from '@components/Chat/styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { NavLink, useParams } from 'react-router-dom';

const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';

const Chat = ({ data }) => {
  const user = 'Sender' in data ? data.Sender : data.User;
  const { workspace } = useParams();

  const result = useMemo(
    () =>
      // uploads\\서버주소
      data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr = match.match(/@\[(.+?)]\((\d+?)\)/);
            if (arr) {
              return (
                <NavLink key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </NavLink>
              );
            }
            return <br key={index} />;
          },
          input: data.content,
        })
      ),
    [data.content, workspace],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default React.memo(Chat);
