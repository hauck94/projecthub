import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
// tslint:disable-next-line: no-submodule-imports
import styled from 'styled-components/macro';
import { authContext } from '../hooks/AuthenticationContext';
import { LinkButton } from './LinkButton';

const Nav = styled.nav`
  z-index: 800;
  background-color: #222;
  display: grid;
  grid-template-columns: auto auto 1fr;
  box-shadow: 0px 3px 11px -3px rgba(0, 0, 0, 0.4);
`;

const Base = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  width: 50px;
  display: grid;
  background-color: white;
  align-items: center;
  justify-items: center;
`;

const ProfilePic = styled.img`
  height: 38px;
  margin: 5px;
`;

const Dropdown = styled.div`
  /* The container <div> - needed to position the dropdown content */
  justify-self: end;
  align-self: center;
  position: relative;
  display: inline-block;
  margin-right: 10px;

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    background-color: ${(props) => props.theme.colors.bodyColor};
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 5px;
    /* Links inside the dropdown */
    a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    /* Change color of dropdown links on hover */
    a:hover {
      background-color: ${(props) => props.theme.colors.bodyHighlightColor};
    }
  }

  /* Show the dropdown menu on hover */
  &:hover .dropdown-content {
    display: block;
  }
`;

export const BaseLayout: React.FC = ({ children }) => {
  const {
    actions: { logout, getTokenData },
  } = useContext(authContext);
  const onLogout = () => {
    logout();
  };
  return (
    <Base>
      <Nav>
        <LogoContainer>
          <img src="/assets/logo.svg" style={{ height: '30px' }} alt="" />
        </LogoContainer>
        <LinkButton to="/dashboard">Overview</LinkButton>
        <Dropdown>
          <ProfilePic className="dropdown-btn" src="/assets/login-user-icon.svg" alt="" />
          <div className="dropdown-content">
            <Link to={`/profile/${getTokenData()?.id}`}>Profile</Link>
            <a href="#" onClick={onLogout}>
              Logout
            </a>
          </div>
        </Dropdown>
      </Nav>
      {children}
    </Base>
  );
};
