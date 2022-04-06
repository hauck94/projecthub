import React, { ChangeEvent, useContext, useState } from 'react';
import { DefaultButton } from '../components/DefaultButton';
import { DefaultInput } from '../components/DefaultInput';
import { authContext, LoginOptions } from '../hooks/AuthenticationContext';
import styled, { ThemeContext } from 'styled-components';
import { Title } from '../components/Title';
import { LinkButton } from '../components/LinkButton';

const LoginMask = styled.form`
  border-radius: 7px;
  padding: 20px;
  box-shadow: 0 4px 5px rgb(0 0 0 / 8%);
  background-color: ${(props) => props.theme.colors.bodyColor};
  width: 375px;
  z-index: 10;
  display: grid;
  grid-template-areas:
    'title title'
    'image image'
    'error error'
    'emailInput emailInput'
    'password password'
    'register login';
  grid-template-columns: 1fr 1fr;
  justify-items: stretch;
  gap: 10px;
`;
const LoginMaskContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.backgroundColor};
`;

const BackgroundTop = styled.div`
  background-image: url('/assets/login-background-top.svg');
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: top right;
  pointer-events: none;
  z-index: 0;
`;

const BackgroundBottom = styled.div`
  background-image: url('/assets/login-background-bottom.svg');
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: bottom right;
  pointer-events: none;
  z-index: 0;
`;

const Footer = styled.p`
  position: absolute;
  bottom: 5px;
  left: 10px;
  z-index: 1;
`;

const FormError = styled.p`
  color: ${(props) => props.theme.colors.danger};
  text-align: center;
  font-size: 10pt;
  margin: 0;
  font-weight: 500;
  grid-area: error;
`;

const Logo = styled.div`
  background-image: url(/assets/logo-full.svg);
  position: absolute;
  top: 20px;
  left: 30px;
  width: 400px;
  height: 200px;
  background-repeat: no-repeat;
  background-position: top left;
  pointer-events: none;
  background-size: 400px;
  z-index: 1;
`;

export const LoginPage: React.FC = (props) => {
  const auth = useContext(authContext);
  const themeContext = useContext(ThemeContext);
  const [formError, setFormError] = useState<string | null>(null);
  const [values, setValues] = useState<LoginOptions>({
    email: '',
    password: '',
  });

  const onInputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    try {
      await auth.actions.login(values);
    } catch (e) {
      setFormError(e.message);
    }
  };

  return (
    <LoginMaskContainer>
      <LoginMask onSubmit={onSubmitForm}>
        <Title style={{ textAlign: 'center', gridArea: 'title' }}>Login</Title>
        <img src="/assets/login-user-icon.svg" alt="" style={{ height: '100px', margin: '10px', gridArea: 'image' }} />
        <FormError className="error">{formError}</FormError>
        <div style={{ gridArea: 'emailInput', display: 'grid' }}>
          <DefaultInput placeholder="E-Mail" name="email" type="email" onChange={onInputChanged} required />
        </div>
        <div style={{ gridArea: 'password', display: 'grid' }}>
          <DefaultInput placeholder="Password" name="password" type="password" onChange={onInputChanged} required />
        </div>
        <LinkButton style={{ gridArea: 'register' }} to="/register">
          Register
        </LinkButton>
        <DefaultButton
          name="submit"
          style={{ gridArea: 'login' }}
          fontColor={'white'}
          color={themeContext.colors.primary}
          type="submit"
        >
          Log In
        </DefaultButton>
      </LoginMask>
      <Logo />
      <BackgroundTop />
      <BackgroundBottom />
      <Footer>© 2021 Project-Hub</Footer>
    </LoginMaskContainer>
  );
};
