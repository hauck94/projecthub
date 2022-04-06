import Dialog from '../../components/Dialog';
import * as React from 'react';
import { DefaultButton } from '../../components/DefaultButton';
import styled, { ThemeContext } from 'styled-components';
import { Title } from '../../components/Title';
import { availableWidgets } from '../../widgets/AvailableWidgets';
import { DefaultInput } from '../../components/DefaultInput';
import { ChangeEvent, useContext, useState } from 'react';
import { WidgetInfo } from '../../models/WidgetInfo';
import Widget from '../../components/Widget';

interface AddWidgetDialogProps {
  show: boolean;
  onWidgetSelected?: (widgetType: string) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 5px 5px 10px;
`;

const DialogContainer = styled.div`
  min-width: 940px;
  min-height: 500px;
  overflow: auto;
  max-height: calc(100vh - 190px);
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const WidgetContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const ItemBase = styled.div`
  background-color: ${(props) => props.theme.colors.bodyHighlightColor};
  box-shadow: 0px 2px 6px -3px rgba(0, 0, 0, 0.35);
  width: 450px;
  height: 300px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  padding: 5px;
`;

const ColoredAvatar = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  height: 100px;
  width: 100px;
  border-radius: 7px;
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 25px;
`;

const ImageAvatar = styled.div`
  background-color: black;
  border-radius: 7px;
  height: 100px;
  width: 100px;
  background-size: cover;
`;

const WidgetItem: React.FC<{
  item: {
    key: string;
    value: {
      info: WidgetInfo;
      component: Widget<any>;
    };
  };
  onWidgetSelected?: (widgetType: string) => void;
}> = ({ item, onWidgetSelected }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <ItemBase>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        {item.value.info.picture ? (
          <ImageAvatar style={{ backgroundImage: `url("${item.value.info.picture}")` }}></ImageAvatar>
        ) : (
          <ColoredAvatar style={{ backgroundColor: 'lightgray' }}>{item.value.info.name[0]}</ColoredAvatar>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px', gap: '5px' }}>
          <span
            style={{
              fontSize: '23px',
              fontWeight: 500,
              margin: '0',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {item.value.info.name}
          </span>
          <a href={item.value.info.url}>{item.value.info.url}</a>
          <div style={{ display: 'flex', gap: '5px' }}>
            {item.value.info.labels?.map((e) => (
              <span
                style={{
                  backgroundColor: themeContext.colors.primary,
                  color: 'white',
                  borderRadius: '100px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flex: '1', overflowY: 'auto' }}>
        {item.value.info.description && (
          <>
            <strong>Description:</strong>
            <div style={{ marginLeft: '10px' }}>{item.value.info.description}</div>
          </>
        )}
        {item.value.info.author && (
          <>
            <div style={{ marginTop: '10px' }}>
              <strong>Author:</strong>
            </div>
            <div style={{ marginLeft: '10px' }}>
              <div>{item.value.info.author}</div>
              <a href={item.value.info.authorUrl}>{item.value.info.authorUrl}</a>
            </div>
          </>
        )}
        {item.value.info.licence && (
          <>
            <div style={{ marginTop: '10px' }}>
              <strong>Licence:</strong>
            </div>
            <div style={{ marginLeft: '10px' }}>{item.value.info.licence}</div>
          </>
        )}
      </div>
      <DefaultButton
        style={{ alignSelf: 'flex-end' }}
        fontColor="white"
        color={themeContext.colors.primary}
        key={item.key}
        onClick={() => onWidgetSelected?.(item.key)}
      >
        add to Page
      </DefaultButton>
    </ItemBase>
  );
};

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ show, onWidgetSelected, onCancel }) => {
  const [filteredWidgets, setFilteredWidgets] = useState(Object.entries(availableWidgets));
  const [search, setSearch] = useState('');

  const filterWidgets = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = Object.entries(availableWidgets).filter(([key, value]) => {
      return key.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) !== -1;
    });
    setFilteredWidgets(filtered);
    setSearch(e.target.value);
  };

  return (
    <Dialog
      show={show}
      buttons={[
        {
          text: 'cancel',
          onClick: (e) => {
            onCancel?.(e);
            setSearch('');
            setFilteredWidgets(Object.entries(availableWidgets));
          },
        },
      ]}
    >
      <TopBar>
        <Title>Widgets</Title>
        <DefaultInput style={{ width: '400px' }} onChange={filterWidgets} value={search} placeholder="search widget" />
      </TopBar>
      <DialogContainer>
        <WidgetContainer>
          {filteredWidgets.map(([key, value]) => (
            <WidgetItem item={{ key, value }} onWidgetSelected={onWidgetSelected} />
          ))}
        </WidgetContainer>
      </DialogContainer>
    </Dialog>
  );
};
export default AddWidgetDialog;
