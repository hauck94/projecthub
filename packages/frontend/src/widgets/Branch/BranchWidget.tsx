import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Widget from '../../components/Widget';
import { BranchData, BranchWidgetData } from './BranchWidgetModel';

const WidgetBackground = styled.div`
  background-color: #d6deff;
  height: 100%;
  padding: 10px;
`;

const WidgetHeader = styled.h4`
  position: absolute;
`;

const BranchesContainer = styled.div`
  overflow: auto;
  height: 100%;
  margin-top: 35px;
`;

const BranchContainer = styled.div`
  width: 100%;
  height: auto;
  float: left;
`;

const BranchCell = styled.div`
  float: left;
  width: 19%;
`;

const BranchUrlCell = styled.div`
  float: left;
  text-align: right;
  width: 5%;
`;

const BranchWidget: Widget<BranchWidgetData> = ({ saveData, data }) => {
  const [branches, setBranches] = useState<BranchData[]>([]);

  const fetchIssues = async () => {
    const apiUrl = data.data?.url;
    const apiVersion = data.data?.apiVersion;
    const projectId = data.data?.projectId;
    const accessToken = data.data?.accessToken;

    // e.g. https://code.fbi.h-da.de/api/v4/projects/:id/repository/branches
    const requestUrl = apiUrl + '/api/v' + apiVersion + '/projects/' + projectId + '/repository/branches';
    console.log(requestUrl);

    const branchRequest = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (branchRequest.ok) {
      const responseBranches = await branchRequest.json();

      const currentBranches: BranchData[] = [];

      // mapping branches recieved from external API in order to get the relevant data that is needed
      responseBranches.map((branch: any) => {
        const currentBranch: BranchData = {
          name: branch.name,
          mergedIntoMaster: branch.merged,
          lastCommit: branch.commit.committed_date,
          lastCommitMessage: branch.commit.message,
          lastCommitDeveloper: branch.commit.author_name,
          url: branch.web_url,
        };

        currentBranches.push(currentBranch);
      });

      setBranches(currentBranches);
    } else {
      alert('error getting branches');
    }
  };

  // TODO: should only fetch when variable changes
  useEffect(() => {
    fetchIssues();
  }, [data]);

  // TODO: format Date
  return (
    <WidgetBackground style={{ backgroundColor: data.data?.backgroundColor }}>
      <WidgetHeader>GitLab Project Branches</WidgetHeader>
      <BranchesContainer>
        {branches.map((branchData) => {
          return (
            <BranchContainer>
              <BranchCell style={{ color: data.data?.fontColor }}>Name: {branchData.name}</BranchCell>
              <BranchCell style={{ color: data.data?.fontColor }}>
                Merged into Master: {branchData.mergedIntoMaster.toString()}
              </BranchCell>

              <BranchCell style={{ color: data.data?.fontColor }}>Last Commit Date: {branchData.lastCommit}</BranchCell>
              <BranchCell style={{ color: data.data?.fontColor }}>
                Last Commit Message: {branchData.lastCommitMessage}
              </BranchCell>
              <BranchCell style={{ color: data.data?.fontColor }}>
                Last Commit Developer: {branchData.lastCommitDeveloper}
              </BranchCell>
              <BranchUrlCell style={{ color: data.data?.fontColor }}>
                <a href={branchData.url}>Url</a>
              </BranchUrlCell>
            </BranchContainer>
          );
        })}
      </BranchesContainer>
    </WidgetBackground>
  );
};

export default BranchWidget;
