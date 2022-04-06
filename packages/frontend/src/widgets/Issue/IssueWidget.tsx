import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Widget from '../../components/Widget';
import { IssueData, IssueWidgetData } from './IssueWidgetModel';

const WidgetBackground = styled.div`
  background-color: #fcd059;
  height: 100%;
  padding: 10px;
`;

const WidgetHeader = styled.h4`
  position: absolute;
`;

const IssuesContainer = styled.div`
  overflow: auto;
  height: 100%;
  margin-top: 35px;
`;

const IssueContainer = styled.div`
  width: 100%;
  height: auto;
  float: left;
`;

const IssueCell = styled.div`
  float: left;
  width: 20%;
`;

const IssueWidget: Widget<IssueWidgetData> = ({ saveData, data }) => {
  const [issues, setIssues] = useState<IssueData[]>([]);

  const fetchIssues = async () => {
    const apiUrl = data.data?.url;
    const apiVersion = data.data?.apiVersion;
    const projectId = data.data?.projectId;
    const accessToken = data.data?.accessToken;

    // e.g. https://code.fbi.h-da.de/api/v4/projects/:id/issues
    const requestUrl = apiUrl + '/api/v' + apiVersion + '/projects/' + projectId + '/issues';

    const issueRequest = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (issueRequest.ok) {
      const responseIssues = await issueRequest.json();

      const currentIsssues: IssueData[] = [];

      // mapping issues recieved form external API in order to get the relevant data that is needed

      for (const issue of responseIssues) {
        const currentIssue: IssueData = {
          issueId: issue.iid,
          title: issue.title,
          state: issue.state,
          creator: issue.author.name,
          labels: issue.labels,
        };

        currentIsssues.push(currentIssue);
      }

      setIssues(currentIsssues);
    } else {
      alert('error getting issues');
    }
  };

  // TODO: should only fetch when variable changes
  useEffect(() => {
    fetchIssues();
  }, [data]);

  return (
    <WidgetBackground style={{ backgroundColor: data.data?.backgroundColor }}>
      <WidgetHeader style={{ color: data.data?.fontColor }}>GitLab Project Issues</WidgetHeader>
      <IssuesContainer>
        {issues.map((issueData) => {
          return (
            <IssueContainer>
              <IssueCell style={{ color: data.data?.fontColor }}>Issue-Id: {issueData.issueId}</IssueCell>
              <IssueCell style={{ color: data.data?.fontColor }}>Title: {issueData.title}</IssueCell>
              <IssueCell style={{ color: data.data?.fontColor }}>State: {issueData.state}</IssueCell>
              <IssueCell style={{ color: data.data?.fontColor }}>Creator: {issueData.creator}</IssueCell>
              <IssueCell style={{ color: data.data?.fontColor }}>Labels: {issueData.labels}</IssueCell>
            </IssueContainer>
          );
        })}
      </IssuesContainer>
    </WidgetBackground>
  );
};

export default IssueWidget;
