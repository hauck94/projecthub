import React, { useState, ChangeEvent, useContext } from 'react';
import { authContext, RegisterOptions } from '../hooks/AuthenticationContext';
import { DefaultInput } from '../components/DefaultInput';
import { DefaultButton } from '../components/DefaultButton';
import styled, { ThemeContext } from 'styled-components';
import { Title } from '../components/Title';
import { LinkButton } from '../components/LinkButton';

const RegisterMask = styled.form`
  border-radius: 7px;
  padding: 20px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.075);
  background-color: ${(props) => props.theme.colors.bodyColor};
  display: grid;
  display: grid;
  gap: 40px;
  grid-template-areas:
    'title title'
    'image form';
  grid-template-rows: 1fr auto;
  align-items: center;
  z-index: 10;
`;

const RegisterMaskContainer = styled.div`
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
  margin: 0px 0 7px 0px;
  font-weight: 500;
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

const InputContainer = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RegisterPage = () => {
  const auth = useContext(authContext);
  const themeContext = useContext(ThemeContext);
  const [values, setValues] = useState<RegisterOptions>({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const onInputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (values.password !== values.repeatPassword) {
      setFormError('Password values do not match.');
      return;
    }

    setFormError(null);
    try {
      await auth.actions.register(values);
    } catch (e) {
      setFormError(e.message);
    }
  };
  return (
    <RegisterMaskContainer>
      <RegisterMask onSubmit={onSubmitForm} style={{ zIndex: 10 }}>
        <Title>Register</Title>
        <LinkButton style={{ justifySelf: 'end' }} to="/login">
          Back to Login
        </LinkButton>
        <img
          onDragStart={(e) => e.preventDefault()}
          style={{ width: '270px', margin: '0px 10px 30px 10px' }}
          src="/assets/undraw_arrived_f58d.svg"
          alt=""
        />
        <InputContainer>
          <FormError className="error">{formError}</FormError>
          <DefaultInput placeholder="Name" name="name" type="text" onChange={onInputChanged} required></DefaultInput>
          <DefaultInput
            placeholder="E-Mail"
            name="email"
            type="email"
            onChange={onInputChanged}
            required
          ></DefaultInput>
          <DefaultInput
            placeholder="Password"
            name="password"
            type="password"
            onChange={onInputChanged}
            required
          ></DefaultInput>
          <DefaultInput
            placeholder="Confirm Password"
            name="repeatPassword"
            type="password"
            onChange={onInputChanged}
            required
          ></DefaultInput>
          <DefaultButton
            fontColor={'white'}
            color={themeContext.colors.primary}
            style={{ marginBottom: '20px' }}
            type="submit"
          >
            Register
          </DefaultButton>
        </InputContainer>
      </RegisterMask>
      <Logo />
      <BackgroundTop />
      <BackgroundBottom />
      <Footer>© 2021 Project-Hub</Footer>
    </RegisterMaskContainer>
  );
};
