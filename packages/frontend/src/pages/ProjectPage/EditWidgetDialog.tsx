import React, { useContext, useEffect, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import ColorPickerButton from '../../components/ColorPickerButton';
import { DefaultInput } from '../../components/DefaultInput';
import DefaultLabel from '../../components/DefaultLabel';
import DefaultSelect from '../../components/DefaultSelect';
import { DefaultTextArea } from '../../components/DefaultTextArea';
import Dialog from '../../components/Dialog';
import { Title } from '../../components/Title';
import { WidgetData } from '../../models/WidgetData';
import { WidgetInfo } from '../../models/WidgetInfo';
import { SettingType } from '../../models/WidgetSettings';
import { availableWidgets } from '../../widgets/AvailableWidgets';

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
interface EditWidgetDialogProps {
  showForData?: WidgetData<any>;
  onApply?: (newData: WidgetData<any> | undefined) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const EditWidgetDialog: React.FC<EditWidgetDialogProps> = ({ showForData, onApply, onCancel }) => {
  const themeContext = useContext(ThemeContext);
  const [tmpData, setTmpData] = useState<any>(showForData?.data ? JSON.parse(JSON.stringify(showForData.data)) : {});
  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(1);
  let [requiredCount, setRequiredCount] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // update all fields
    if (showForData) {
      const tmp = JSON.parse(JSON.stringify(showForData)) as WidgetData<any>;
      const settings = availableWidgets[showForData.type].info.settings;
      setHeight(tmp.h);
      setWidth(tmp.w);

      if (settings && JSON.stringify(tmp.data) === JSON.stringify({})) {
        for (const [key, value] of Object.entries(settings)) {
          if (tmp.data[key] === undefined) {
            tmp.data[key] = value.default;
            if (value.required) {
              setRequiredCount((r) => ({ ...r, [key]: false }));
            }
          }
        }
      }
      setTmpData(tmp.data);
    } else {
      setTmpData({});
    }
  }, [showForData]);

  function setChange(key: string, value: any) {
    if (JSON.stringify(tmpData) !== JSON.stringify({})) {
      const tmp = JSON.parse(JSON.stringify(tmpData));
      tmp[key] = value;
      setTmpData(tmp);
    }
  }

  // add type-safety for "selectType" function parameters
  interface SettingTypeExtension extends SettingType<any> {
    [x: string]: any;
  }

  function selectType(key: string, value: SettingTypeExtension) {
    switch (value.type) {
      case 'toggle':
        return <h1>Toggle PLACEHOLDER</h1>;
      case 'slider':
        return <div>Slider PLACEHOLDER</div>;
      case 'colorPicker':
        return (
          <ColorPickerButton
            value={tmpData[key]}
            onChange={(e) => {
              setChange(key, e.target.value);
            }}
          />
        );
      case 'singleSelect':
        return (
          <DefaultSelect
            options={value.list}
            defaultValue={value.default}
            onChange={(selectedOption) => {
              if (selectedOption) {
                setChange(key, selectedOption);
              }
            }}
          />
        );
      case 'multiSelect':
        return (
          <DefaultSelect
            options={value.list}
            defaultValue={value.default}
            onChange={(selectedOption) => {
              if (selectedOption) {
                setChange(key, selectedOption);
              }
            }}
          />
        );
      case 'textField':
        return (
          <DefaultInput
            placeholder={value.placeholder ? value.placeholder : value.name}
            type="text"
            value={tmpData[key]}
            onChange={(e) => {
              if (value.required) {
                if (e.target.value === '') {
                  setRequiredCount((r) => ({ ...r, [key]: false }));
                } else if (e.target.value.length >= 1) {
                  setRequiredCount((r) => ({ ...r, [key]: true }));
                }
              }
              setChange(key, e.target.value);
            }}
          />
        );
      case 'numberField':
        return <div>numberField PLACEHOLDER</div>;
      case 'emailField':
        return <div>emailField PLACEHOLDER</div>;
      case 'textArea':
        return (
          <DefaultTextArea
            placeholder={value.placeholder ? value.placeholder : value.name}
            style={{ height: '200px' }}
            value={tmpData[key]}
            onChange={(e) => {
              if (value.required) {
                if (e.target.value === '') {
                  setRequiredCount((r) => ({ ...r, [key]: false }));
                } else if (e.target.value.length >= 1) {
                  setRequiredCount((r) => ({ ...r, [key]: true }));
                }
              }
              setChange(key, e.target.value);
            }}
          />
        );
      case 'secretPicker':
        return <div>secretPicker PLACEHOLDER</div>;
      case 'imageUpload':
        return <div>imageUpload PLACEHOLDER</div>;
    }
  }

  function generateDialog(settings: { [x: string]: SettingType<any> }) {
    const returnVal: JSX.Element[] = [];
    if (JSON.stringify(tmpData) !== JSON.stringify({})) {
      for (const [key, value] of Object.entries(settings)) {
        returnVal.push(
          <SettingsContainer key={key}>
            <DefaultLabel style={{ justifySelf: 'start' }} tooltip={value.description}>
              {value.name}
              {value.required ? '*' : null}
            </DefaultLabel>
            {selectType(key, value)}
          </SettingsContainer>,
        );
      }
    }
    return returnVal;
  }

  function addSizeSelector(info: WidgetInfo) {
    if (JSON.stringify(tmpData) !== JSON.stringify({}) && info.size.length > 1) {
      const options = info.size.map((entry) => ({
        value: JSON.stringify(entry),
        label: `width: ${entry.width} height: ${entry.height}`,
      }));

      return (
        <SettingsContainer>
          <DefaultLabel
            style={{ justifySelf: 'start' }}
            tooltip="The size attribute defines the grid width and height of the widget."
          >
            Size
          </DefaultLabel>
          <DefaultSelect
            options={options}
            defaultValue={{
              value: JSON.stringify({ width, height }),
              label: `width: ${width} height: ${height}`,
            }}
            onChange={(selectedOption) => {
              if (selectedOption) {
                const newValue = JSON.parse((selectedOption as { label: string; value: string })?.value) as {
                  width: number;
                  height: number;
                };
                setHeight(newValue.height);
                setWidth(newValue.width);
              }
            }}
          />
        </SettingsContainer>
      );
    } else {
      return null;
    }
  }

  if (showForData) {
    const settings = availableWidgets[showForData.type].info.settings;
    if (settings) {
      return (
        <Dialog
          show={showForData !== undefined}
          buttons={[
            {
              text: 'apply',
              onClick: () => {
                setRequiredCount({});
                if (showForData !== undefined) {
                  const newVal: WidgetData<any> = JSON.parse(JSON.stringify(showForData));
                  newVal.data = tmpData;
                  newVal.w = width;
                  newVal.h = height;
                  onApply?.(newVal);
                }
              },
              fontColor: 'white',
              color: themeContext.colors.primary,
              disabled: Object.entries(requiredCount).find(([_, value]) => value === false) ? true : false,
            },
            {
              text: 'cancel',
              onClick: (e) => {
                setRequiredCount({});
                onCancel?.(e);
              },
            },
          ]}
        >
          <TopBar>
            <Title>{availableWidgets[showForData.type].info.name} Settings</Title>
          </TopBar>

          <DialogContainer>
            {addSizeSelector(availableWidgets[showForData.type].info)}
            {generateDialog(settings)}
            <div
              style={{
                flexGrow: 1,
                alignItems: 'start',
                display: Object.entries(settings).find(([key, value]) => value.required === true) ? 'flex' : 'none',
                flexDirection: 'column',
              }}
            >
              <div style={{ flexGrow: 1 }}></div>
              <FormError>Fields marked with * are required.</FormError>
            </div>
          </DialogContainer>
        </Dialog>
      );
    }
  }
  return (
    <Dialog show={showForData !== undefined} buttons={[{ text: 'cancel', onClick: onCancel }]}>
      <h2>An Error occured during data loading</h2>
    </Dialog>
  );
};

export default EditWidgetDialog;
