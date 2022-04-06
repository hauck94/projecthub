/*
Profile should display the following infos
username, firstname, lastname, email, profile-picture, member since XXX
Job title, Bio, Organization, Location, Website url
social media links
  - add component for adding social media
  - component should be a key, value list that can be dynamically grow/shrink based on the entries
  - key = social media platform | value = profile name / link / identifier / etc.
edit profile - all profile relevant information can be changed here
current status - add a status information (text)
*/

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { authContext } from '../hooks/AuthenticationContext';
import { User } from '../models/User';
import { Title } from '../components/Title';

const ProfileBase = styled.div`
  background-color: ${(props) => props.theme.colors.bodyColor};
  border-radius: 7px;
  width: 100%;
  display: flex;
  align-self: center;
  padding: 20px;
  flex-direction: column;
  align-items: center;
`;

const PageContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 75%;
`;

const PageTitle = styled(Title)`
  font-size: 34pt;
  font-weight: normal;
  margin: 10px;
  margin-top: 50px; // height of TopButtons
  margin-bottom: 20px;
`;

const ProfilePage: React.FC = () => {
  const {
    token,
    actions: { authFetch },
  } = useContext(authContext);
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    authFetch(`/api/users/${id}`, {}).then((res) => {
      if (res.status === 200) {
        res.json().then((json) => setUser(json.data));
      }
    });
  }, [id, token]);

  return (
    <PageContainer>
      <CenteredContainer>
        <PageTitle style={{ fontSize: '34pt' }}>User Profile</PageTitle>
        <ProfileBase>
          <img style={{ width: '150px', height: '150px' }} src="/assets/login-user-icon.svg" alt="" />
          <h1>{user?.name}</h1>
          <h3>{user?.email}</h3>
          <h3>ID: {user?.id}</h3>
        </ProfileBase>
      </CenteredContainer>
    </PageContainer>
  );
};

export default ProfilePage;
