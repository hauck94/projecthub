import Dialog from '../../components/Dialog';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { DefaultButton } from '../../components/DefaultButton';
import styled, { ThemeContext } from 'styled-components';
import { Title } from '../../components/Title';
import { Tabs, Tab, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { Project } from '../../models/Project';
import { authContext } from '../../hooks/AuthenticationContext';
import Badge from 'react-bootstrap/Badge';
import { MemberInfo } from '../../models/MemberInfo';

interface ProjectSettingsDialogProps {
  show: boolean;
  project?: Project;
  onSave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onEditPage?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface IProjectRouteParams {
  id: string;
}

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 5px 5px 10px;
`;

const DialogContainer = styled.div`
  min-width: 500px;
  min-height: 300px;
`;

const Input = styled.input.attrs((props) => ({
  // we can define static props
  type: 'text',

  // or we can define dynamic ones
  size: props.size || '0.5em',
}))`
  font-size: 1em;
  border: 1px solid;
  border-radius: 2px;
  width: 80%;
  /* here we use the dynamically computed prop */
  margin: 0.5em;
  padding: ${(props) => props.size};
`;

const ProjectSettingsDialog: React.FC<ProjectSettingsDialogProps> = ({
  show,
  project,
  onSave,
  onCancel,
  onEditPage,
}) => {
  const [user, setUser] = useState<MemberInfo[] | undefined>();
  const {
    actions: { authFetch, getTokenData },
  } = useContext(authContext);
  const [active, setActive] = useState<Boolean>();
  const themeContext = useContext(ThemeContext);

  const [values, setValues] = useState({
    description: project?.description,
    name: project?.name,
  });

  const fieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const fetchUser = async () => {
    const usersRequest = await authFetch('/api/users');
    if (usersRequest.status === 200) {
      const json = await usersRequest.json();
      setUser(json.data);
    }
  };


  useEffect(() => {
    fetchUser();
    setActive(project?.active);
    values.description = project?.description;
    values.name = project?.name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const onSubmitProjectForm = async () => {
    await authFetch(`/api/projects/${project?.id}`, {
      body: JSON.stringify({
        ...project,
        ...values,
        active: active,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    });
  };

  const addUserToProject = async (newMember: MemberInfo) => {
    await authFetch(`/api/projects/${project?.id}/members`, {
      body: JSON.stringify({
        userId: newMember.id,
        permission: 'ro',
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    project?.members.push({ ...newMember, permission: 'ro' });
  };

  const deleteUserFromProject = async (userID: number) => {
    await authFetch(`/api/projects/${project?.id}/members/${userID}`, {
      method: 'DELETE',
    });

    const member = project?.members.find((e) => e.id === userID);
    if (project && member) {
      const index = project.members.indexOf(member);
      project?.members.splice(index, 1);
    }
  };

  const deleteProject = async () => {
    await authFetch(`/api/projects/${project?.id}`, {
      method: 'DELETE',
    });
  };



  const popover = (users: MemberInfo[] | undefined) => (
    <Popover id="popover-basic">
      <Popover.Title as="h2">Public Users</Popover.Title>
      <Popover.Content>
        <ListGroup style={{ marginLeft: '0.5em', marginRight: '0.5em' }}>
          {users?.map((user) => (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Button style={{ margin: '3px', backgroundColor: 'green' }} onClick={(e) => addUserToProject(user)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  <path
                    fill-rule="evenodd"
                    d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                  />
                </svg>
              </Button>
              <ListGroup.Item>
                {user.username}@{user.id}
              </ListGroup.Item>
            </div>
          ))}
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  return (
    <Dialog
      show={show}
      buttons={[
        {
          text: 'save',
          onClick: (e) => {
            onSubmitProjectForm();
            onSave?.(e);
          },
          fontColor: 'white',
          color: themeContext.colors.primary,
        },
        {
          text: 'close',
          onClick: (e) => {
            onCancel?.(e);
          },
        },
      ]}
    >
      {project && (
        <DialogContainer>
          <TopBar>
            <Title>Project Settings</Title>
            <DefaultButton fontColor={'white'} color={themeContext.colors.primary} onClick={onEditPage}>
              edit widgets
            </DefaultButton>
          </TopBar>
          <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
            <Tab eventKey="general" title="General">
              <form>
                <fieldset disabled={project?.members.find((e) => e.id === getTokenData()?.id)?.permission !== 'rw'}>
                  <Input
                    placeholder={project?.name}
                    name="name"
                    type="text"
                    label="Name"
                    onChange={fieldDidChange}
                    value={values.name}
                  />
                  <br />
                  <Input
                    placeholder={project?.description}
                    name="description"
                    type="text"
                    label="Description"
                    onChange={fieldDidChange}
                    value={values.description}
                  />
                  <div id="buttonArea" style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                    {active ? (
                      <Button
                        style={{
                          width: '50%',
                          margin: '3px',
                          color: 'white',
                          backgroundColor: themeContext.colors.danger,
                        }}
                        onClick={() => {
                          setActive(false);
                        }}
                      >
                        close Project
                      </Button>
                    ) : (
                      <Button
                        style={{
                          width: '50%',
                          margin: '3px',
                          color: 'white',
                          backgroundColor: themeContext.colors.primary,
                        }}
                        onClick={() => {
                          setActive(true);
                        }}
                      >
                        reopen Project
                      </Button>
                    )}
                    <DefaultButton
                      fontColor={'white'}
                      color={themeContext.colors.danger}
                      style={{ width: '50%' }}
                      onClick={() => deleteUserFromProject(getTokenData()!.id)}
                    >
                      leave Project
                    </DefaultButton>

                    <DefaultButton
                      fontColor={'white'}
                      color={themeContext.colors.danger}
                      style={{ width: '50%' }}
                      onClick={() => deleteProject()}
                    >
                      delete Project
                    </DefaultButton>
                  </div>
                </fieldset>
              </form>
            </Tab>
            <Tab eventKey="accessManagement" title="Access Management">
              <h3>
                Members{' '}
                <OverlayTrigger trigger="click" placement="right" rootClose={true} overlay={popover(user)}>
                  <Button disabled={project?.members.find((e) => e.id === getTokenData()?.id)?.permission !== 'rw'}>add Member</Button>
                </OverlayTrigger>
              </h3>
              <br />
              <ListGroup style={{ marginLeft: '0.5em', marginRight: '0.5em' }}>
                {project?.members?.map((member) =>
                  getTokenData()?.id === member.id ? (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <ListGroup.Item action href={`#${member.username}`}>
                        <Badge variant="success">It's you</Badge> {member.username}@{member.id}
                      </ListGroup.Item>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <Button
                        style={{ margin: '3px', backgroundColor: 'red' }}
                        onClick={(e) => deleteUserFromProject(member.id)}
                        disabled={project?.members.find((e) => e.id === getTokenData()?.id)?.permission !== 'rw'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-person-x"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                          <path
                            fill-rule="evenodd"
                            d="M12.146 5.146a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </Button>
                      <ListGroup.Item action href={`#${member.username}`}>
                        {member.username}@{member.id}
                      </ListGroup.Item>
                    </div>
                  ),
                )}
              </ListGroup>
            </Tab>
          </Tabs>
        </DialogContainer>
      )}
    </Dialog>
  );
};
export default ProjectSettingsDialog;
