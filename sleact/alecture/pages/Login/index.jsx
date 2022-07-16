import React, { useCallback, useEffect, useState } from 'react';
import useInputs from '@hooks/useInputs';
import axios from 'axios';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
const Login = () => {
  const navigate = useNavigate();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
  });
  const [logInError, setLogInError] = useState(false);

  const [{ email, password }, onChange, reset] = useInputs({ email: 'aa@aa.aa', password: 'aa' });

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          mutate(res.data, false);
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  useEffect(() => {
    if (userData) {
      navigate('/workspace/channel');
    } else if (userData === undefined) {
      return <div>로딩중 ...</div>;
    }
  }, [userData]);

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChange} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChange} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <NavLink to="/signup">회원가입 하러가기</NavLink>
      </LinkContainer>
    </div>
  );
};

export default Login;
