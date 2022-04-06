import React, { useContext, useEffect, useState } from 'react';
import { WidgetData } from '../../models/WidgetData';
import AddWidgetDialog from './AddWidgetDialog';
import ProjectSettingsDialog from './ProjectSettingsDialog';
import WidgetGrid from '../../components/WidgetGrid';
import { DefaultButton } from '../../components/DefaultButton';
import styled, { ThemeContext } from 'styled-components';
import { Title } from '../../components/Title';
import { transparentize } from 'polished';
import DiscardChangesDialog from './DiscardChangesDialog';
import EditWidgetDialog from './EditWidgetDialog';
import { uuidv4 } from '../../utils/Utils';
import { availableWidgets } from '../../widgets/AvailableWidgets';
import { WidgetScaffolding } from '../../components/Widget';
import { authContext } from '../../hooks/AuthenticationContext';
import { useParams } from 'react-router';
import { Project } from '../../models/Project';

const ProjectPageContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;

const TopButtons = styled.div`
  position: fixed;
  right: 20px;
  z-index: 100;
  background-color: ${(props) => transparentize(0.5, props.theme.colors.backgroundColor)};
  backdrop-filter: blur(10px);
  position: fixed;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const SettingsButton = styled.svg`
  width: 36px;
  height: 36px;
  filter: invert(0.4);
  mix-blend-mode: difference;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const ProjectTitle = styled(Title)`
  z-index: 200;
  position: sticky;
  top: 0px;
  font-size: 34pt;
  font-weight: normal;
  margin: 10px;
  margin-top: 50px; // height of TopButtons
  margin-bottom: 20px;
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

interface ProjectPageProps {}

const ProjectPage: React.FC<ProjectPageProps> = () => {
  const [widgets, setWidgets] = useState<WidgetData<Object>[]>([]);
  const [changedWidgets, setChangedWidgets] = useState<WidgetData<Object>[]>([]);
  const [editable, setEditable] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [showDiscardChanges, setShowDiscardChanges] = useState(false);
  const [currentDialogData, setCurrentDialogData] = useState<WidgetData<Object>>();
  const [shrinkTitle, setShrinkTitle] = useState(false);
  const [project, setProject] = useState<Project | undefined>();
  const [loading, setLoading] = useState(false);
  const themeContext = useContext(ThemeContext);
  const {
    actions: { authFetch },
  } = useContext(authContext);
  const { id } = useParams<{ id: string }>();

  const loadProject = async () => {
    setLoading(true);
    const projectRequest = await authFetch(`/api/projects/${id}`);
    if (projectRequest.status === 200) {
      const json = await projectRequest.json();
      setProject(json.data);

      const tmpwidgets = json.data.widgets.map((e: any) => ({
        i: e.id,
        type: e.type,
        x: e.xPos,
        y: e.yPos,
        w: e.width,
        h: e.height,
        data: e.data,
      }));
      setWidgets(tmpwidgets);
      setChangedWidgets(tmpwidgets);
    }
    setLoading(false);
  };

  //fetch project on first Page load
  useEffect(() => {
    loadProject();
  }, []);

  const patchSingleWidget = async (data: WidgetData<Object>) => {
    const singleWidgetRequest = await authFetch('/api/widgets/' + data.i, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        id: data.i,
        type: data.type,
        xPos: data.x,
        yPos: data.y,
        height: data.h,
        width: data.w,
        data: data.data,
      }),
    });
    if (singleWidgetRequest.status === 200) {
      //display an error toast
    }
  };

  const putMultipleChangedWidgets = async (projectId: string, data: WidgetData<Object>[]) => {
    const singleWidgetRequest = await authFetch(`/api/projects/${projectId}/widgets`, {
      method: 'PUT',
      body: JSON.stringify(
        data.map((e) => ({
          id: e.i,
          type: e.type,
          xPos: e.x,
          yPos: e.y,
          height: e.h,
          width: e.w,
          data: e.data,
        })),
      ),
      headers: {
        'content-type': 'application/json',
      },
    });
    if (singleWidgetRequest.status === 200) {
      //display an error toast
    }
  };
  if (!loading) {
    return (
      <ProjectPageContainer
        onScroll={(e) => {
          setShrinkTitle(((e.target as Element)?.scrollTop ?? 0) > 50);
        }}
      >
        <TopButtons>
          {editable && (
            <>
              <DefaultButton onClick={() => setShowAddWidget(true)} color={themeContext.colors.contentDarkerColor}>
                add widget
              </DefaultButton>
              <DefaultButton
                fontColor={'white'}
                color={themeContext.colors.danger}
                onClick={() => {
                  if (JSON.stringify(widgets) === JSON.stringify(changedWidgets)) {
                    setChangedWidgets(JSON.parse(JSON.stringify(widgets)));
                    setEditable(false);
                  } else {
                    setShowDiscardChanges(true);
                  }
                }}
              >
                discard changes
              </DefaultButton>
              <DefaultButton
                fontColor={'white'}
                color={themeContext.colors.primary}
                onClick={() => {
                  setWidgets(JSON.parse(JSON.stringify(changedWidgets)));
                  if (JSON.stringify(widgets) !== JSON.stringify(changedWidgets)) {
                    putMultipleChangedWidgets(id, changedWidgets);
                  }
                  setEditable(false);
                }}
              >
                save changes
              </DefaultButton>
            </>
          )}
          {!editable && (
            <SettingsButton
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              viewBox="0 0 24 24"
              onClick={() => setShowSettings(true)}
            >
              <g>
                <path d="M0,0h24v24H0V0z" fill="none" />
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
              </g>
            </SettingsButton>
          )}
        </TopButtons>
        <GridContainer>
          <ProjectTitle style={{ fontSize: shrinkTitle ? '26pt' : '34pt' }}>{project?.name}</ProjectTitle>
          {changedWidgets.length ? (
            <WidgetGrid
              editable={editable}
              widgets={changedWidgets}
              onLayoutChange={(layout) => {
                const tmpWidgets: WidgetData<any>[] = [];
                for (const l of layout) {
                  const tmp = JSON.parse(JSON.stringify(changedWidgets.find((w) => w.i === l.i)));
                  if (tmp) {
                    tmp.h = l.h;
                    tmp.w = l.w;
                    tmp.x = l.x;
                    tmp.y = l.y;
                    tmpWidgets.push(tmp);
                  }
                }
                setChangedWidgets(tmpWidgets);
              }}
            >
              {changedWidgets.map((entry) => {
                for (const wt in availableWidgets) {
                  if (entry.type === wt) {
                    const WidgetTemplate = availableWidgets[wt].component;
                    return (
                      <WidgetScaffolding
                        key={entry.i}
                        data={entry as WidgetData<any>}
                        editable={editable}
                        onEdit={(e, data) => {
                          setCurrentDialogData(data);
                        }}
                        onDelete={(e) => {
                          const tmpWidgets = changedWidgets.slice();
                          if (tmpWidgets) {
                            tmpWidgets.splice(
                              tmpWidgets.findIndex((i) => i.i === entry.i),
                              1,
                            );
                            setChangedWidgets(tmpWidgets);
                          }
                        }}
                      >
                        <WidgetTemplate
                          data={entry as WidgetData<any>}
                          saveData={(data) => {
                            const tmpWidgets = changedWidgets.slice();
                            if (tmpWidgets) {
                              tmpWidgets.splice(
                                tmpWidgets.findIndex((i) => i.i === entry.i),
                                1,
                                data,
                              );
                              setChangedWidgets(tmpWidgets);
                              patchSingleWidget(data);
                            }
                          }}
                        />
                      </WidgetScaffolding>
                    );
                  }
                }
                return <p>Error: Widget could not be found!</p>;
              })}
            </WidgetGrid>
          ) : (
            <img onDragStart={(e) => e.preventDefault()} src="/assets/no-widget.svg" alt="" />
          )}
        </GridContainer>
        <ProjectSettingsDialog
          show={showSettings}
          onCancel={() => setShowSettings(false)}
          onSave={() => setShowSettings(false)}
          project={project}
          onEditPage={() => {
            setEditable(true);
            setShowSettings(false);
          }}
        />
        <AddWidgetDialog
          show={showAddWidget}
          onCancel={() => setShowAddWidget(false)}
          onWidgetSelected={(widgetType) => {
            const size = availableWidgets[widgetType].info.size[0];
            setCurrentDialogData({
              type: widgetType,
              i: uuidv4(),
              w: size.width,
              h: size.height,
              x: 0,
              y: 0,
              data: {},
            });
            setShowAddWidget(false);
          }}
        />
        <DiscardChangesDialog
          show={showDiscardChanges}
          onCancel={() => setShowDiscardChanges(false)}
          onDiscard={() => {
            setChangedWidgets(JSON.parse(JSON.stringify(widgets)));
            setEditable(false);
            setShowDiscardChanges(false);
          }}
        />
        <EditWidgetDialog
          showForData={currentDialogData}
          onCancel={() => setCurrentDialogData(undefined)}
          onApply={(newData) => {
            if (newData) {
              const tmpWidgets = changedWidgets.slice();
              const index = tmpWidgets.findIndex((i) => i.i === newData.i);
              if (index !== -1) {
                tmpWidgets.splice(index, 1, newData);
                setChangedWidgets(tmpWidgets);
              } else {
                tmpWidgets.push(newData);
                setChangedWidgets(tmpWidgets);
              }
              setCurrentDialogData(undefined);
            }
          }}
        />
      </ProjectPageContainer>
    );
  } else {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1>loading...</h1>
      </div>
    );
  }
};
export default ProjectPage;
