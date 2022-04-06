import React, { useContext } from 'react';
import { Card, Accordion, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { authContext } from '../../../hooks/AuthenticationContext';
import { Project } from '../../../models/Project';

export type ProjectItemProps = {
  project: Project;
};

const Role = styled.div`
  width: fit-content;
  padding: 5px 10px;
  font-size: 10pt;
  font-weight: 500;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 100px;
  min-width: 80px;
`;

const Item = styled.div`
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  margin: 10px 0;
  display: grid;
  align-items: center;
  grid-template-columns: 70px 1fr 300px 100px 120px;
  padding: 5px;
`;

const ProjectName = styled.span`
  margin-left: 20px;
  font-size: 14pt;
  font-weight: 500;
`;

const ColoredAvatar = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  height: 60px;
  width: 60px;
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
  height: 60px;
  width: 60px;
  background-size: cover;
`;

export const ProjectList: React.FC<ProjectItemProps> = ({ project }) => {
  const {
    actions: { getTokenData },
  } = useContext(authContext);

  return (
    <Item style={{ width: '100%' }} key={project.id}>
      <div>
        <Link style={{ textDecoration: 'none' }} to={`/project/${project.id}`}>
          {project.picture && project.picture[0] !== '#' ? (
            <ImageAvatar style={{ backgroundImage: `url("${project.picture}")` }}></ImageAvatar>
          ) : (
            <ColoredAvatar style={{ backgroundColor: project.picture ?? 'lightgray' }}>{project.name[0]}</ColoredAvatar>
          )}
        </Link>
      </div>
      <ProjectName>
        <Link to={`/project/${project.id}`}>{project.name}</Link>
      </ProjectName>
      <div style={{ justifySelf: 'center' }}>
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Details
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <h5>Description</h5>
                {project.description}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>

      <div style={{ justifySelf: 'center' }}>
        {project.members.find((e) => e.id === getTokenData()?.id)?.permission === 'rw' ? (
          <Role style={{ backgroundColor: '#ffe528' }}>Owner</Role>
        ) : (
          <Role style={{ backgroundColor: '#cccccc' }}>Member</Role>
        )}
      </div>
      <div style={{ justifySelf: 'right' }}>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Team
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {project.members.map((member) => (
              <Dropdown.Item key={member.id}>
                {member.username}@{member.id}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Item>
  );
};
