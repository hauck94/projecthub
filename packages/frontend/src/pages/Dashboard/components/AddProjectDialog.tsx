import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { DefaultInput } from '../../../components/DefaultInput';
import DefaultLabel from '../../../components/DefaultLabel';
import { DefaultTextArea } from '../../../components/DefaultTextArea';
import Dialog from '../../../components/Dialog';
import { Title } from '../../../components/Title';
import { authContext } from '../../../hooks/AuthenticationContext';

interface ProjectSettingsDialogProps {
  show: boolean;
  onSave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onEditPage?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 5px 5px 10px;
`;

const DialogContainer = styled.div`
  width: 520px;
  min-height: 300px;
  overflow: auto;
  max-height: calc(100vh - 190px);
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const SettingsContainer = styled.div`
  display: grid;
  margin-bottom: 20px;
`;

const FormError = styled.p`
  color: ${(props) => props.theme.colors.danger};
  text-align: center;
  font-size: 10pt;
  margin: 0;
  font-weight: 500;
  flex-grow: 0;
`;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const AddProjectDialog: React.FC<ProjectSettingsDialogProps> = ({ show, onCancel, onSave }) => {
  const {
    actions: { authFetch, getTokenData },
  } = useContext(authContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState('');
  const [disableButton, setDisableButton] = useState(true);

  const onSubmitForm = async () => {
    await authFetch('/api/projects/', {
      body: JSON.stringify({
        name,
        description,
        picture: picture.length !== 0 ? picture : getRandomColor(),
        members: [{ id: getTokenData()!.id, permission: 'rw' }],
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  };

  const clearInputs = () => {
    setName('');
    setDescription('');
    setPicture('');
  };

  return (
    <Dialog
      show={show}
      buttons={[
        {
          text: 'close',
          onClick: (e) => {
            clearInputs();
            onCancel?.(e);
          },
        },
        {
          text: 'create',
          onClick: (e) => {
            setDisableButton(true);
            onSubmitForm().then(() => {
              clearInputs();
              onSave?.(e);
              setDisableButton(false);
            });
          },
          disabled: disableButton,
          fontColor: 'white',
          color: '#3f68e0',
        },
      ]}
    >
      <div id="project-settings-dialog">
        <TopBar>
          <Title>Create Project</Title>
        </TopBar>
      </div>
      <DialogContainer onSubmit={onSubmitForm}>
        <SettingsContainer>
          <DefaultLabel style={{ justifySelf: 'start' }} tooltip="name of the project">
            Name*
          </DefaultLabel>
          <DefaultInput
            placeholder="name of the project"
            name="name"
            type="text"
            onChange={(e) => {
              if (e.target.value.length !== 0) {
                setDisableButton(false);
              } else {
                setDisableButton(true);
              }
              setName(e.target.value);
            }}
            required={true}
            value={name}
          />
        </SettingsContainer>
        <SettingsContainer>
          <DefaultLabel style={{ justifySelf: 'start' }} tooltip="describe your project here">
            Description
          </DefaultLabel>
          <DefaultTextArea
            style={{ height: '200px' }}
            placeholder="describe your project here"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            required={true}
            value={description}
          />
        </SettingsContainer>
        <SettingsContainer>
          <DefaultLabel style={{ justifySelf: 'start' }} tooltip="enter the url of your desired project icon">
            Project Avatar
          </DefaultLabel>
          <DefaultInput
            placeholder="enter the url of your desired project icon"
            name="iconStr"
            type="text"
            onChange={(e) => setPicture(e.target.value)}
            required={true}
            value={picture}
          />
        </SettingsContainer>
        <div
          style={{
            flexGrow: 1,
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flexGrow: 1 }}></div>
          <FormError>Fields marked with * are required.</FormError>
        </div>
      </DialogContainer>
    </Dialog>
  );
};
export default AddProjectDialog;
