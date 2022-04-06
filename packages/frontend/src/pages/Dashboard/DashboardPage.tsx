import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import styled, { ThemeContext } from 'styled-components';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { Title } from '../../components/Title';
import { authContext } from '../../hooks/AuthenticationContext';
import { Project } from '../../models/Project';
import AddProjectDialog from './components/AddProjectDialog';

import { ProjectList } from './components/ProjectItem';

const PageContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;

const OverviewBase = styled.div`
  background-color: ${(props) => props.theme.colors.bodyColor};
  border-radius: 7px;
  display: flex;
  align-self: center;
  padding: 20px;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  min-height: 400px;
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

const TableError = styled.h3`
  color: rgba(0, 0, 0, 0.5);
  margin-top: 30px;
  text-align: center;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const DashboardPage: React.FC = () => {
  const {
    actions: { authFetch },
  } = useContext(authContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);

  const fetchProjects = async () => {
    setLoading(true);
    const projectRequest = await authFetch('/api/projects');
    if (projectRequest.status === 200) {
      const projectJSON = await projectRequest.json();
      setProjects(projectJSON.data);
      setFilteredProjects(projectJSON.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filterProjects = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = projects.filter((project) => {
      return project.name.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) !== -1;
    });
    setFilteredProjects(filtered);
  };

  return (
    <PageContainer>
      <CenteredContainer>
        <PageTitle style={{ fontSize: '34pt' }}>Project Overview</PageTitle>
        <OverviewBase>
          <TopBar style={{ display: 'flex' }}>
            <DefaultInput style={{ flex: '1' }} onChange={filterProjects} placeholder="search Project" />
            <DefaultButton
              fontColor="white"
              color={themeContext.colors.primary}
              onClick={() => setShowAddProject(true)}
            >
              create project
            </DefaultButton>
          </TopBar>
          <Tabs defaultActiveKey="active" id="uncontrolled-tab-example">
            <Tab
              style={{ width: '100%' }}
              eventKey="active"
              title={'Active (' + projects.filter((e) => e.active).length + ')'}
            >
              {!loading ? (
                (() => {
                  const tmpList = filteredProjects.filter((e) => e.active);
                  return tmpList.length ? (
                    tmpList.map((e) => <ProjectList project={e} />)
                  ) : (
                    <TableError>no entries found</TableError>
                  );
                })()
              ) : (
                <TableError>Loading...</TableError>
              )}
            </Tab>
            <Tab eventKey="closed" title={'Closed (' + projects.filter((e) => !e.active).length + ')'}>
              {!loading ? (
                (() => {
                  const tmpList = filteredProjects.filter((e) => !e.active);
                  return tmpList.length ? (
                    tmpList.map((e) => <ProjectList project={e} />)
                  ) : (
                    <TableError>no entries found</TableError>
                  );
                })()
              ) : (
                <TableError>Loading...</TableError>
              )}
            </Tab>
          </Tabs>
          <AddProjectDialog
            show={showAddProject}
            onCancel={() => {
              setShowAddProject(false);
            }}
            onSave={() => {
              fetchProjects();
              setShowAddProject(false);
            }}
          />
        </OverviewBase>
      </CenteredContainer>
    </PageContainer>
  );
};

export default DashboardPage;
