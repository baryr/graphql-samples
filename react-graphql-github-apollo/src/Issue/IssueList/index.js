import React, { useState } from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import produce from 'immer';

import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';
import FetchMore from '../../FetchMore';

import { GET_ISSUES_OF_REPOSITORY } from './queries';

import './style.css';

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const updateQuery = (previousResult, {fetchMoreResult}) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return produce(previousResult, draft => {
    draft.repository.issues.pageInfo = fetchMoreResult.repository.issues.pageInfo;
    draft.repository.issues.edges = [
      ...previousResult.repository.issues.edges,
      ...fetchMoreResult.repository.issues.edges
    ]
  });
};

const Issues = ({ 
  repositoryOwner, 
  repositoryName 
}) => {

  const [issueState, setIssueState] = useState(ISSUE_STATES.NONE);

  return (
    <div className="Issues">
      <IssueFilter
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        issueState={issueState}
        onChangeIssueState={setIssueState}
      />

      {isShow(issueState) && (
        <Query
          query={GET_ISSUES_OF_REPOSITORY}
          variables={{
            repositoryOwner,
            repositoryName,
            issueState
          }}
          notifyOnNetworkStatusChange={true}
        >
          {({ data, loading, error, fetchMore }) => {
            if (error) {
              return <ErrorMessage error={error} />;
            }

            const { repository } = data;

            if (loading && !repository) {
              return <Loading />;
            }

            if (!repository.issues.edges.length) {
              return <div className="IssueList">No issues ...</div>;
            }

            return (
                <IssueList
                  issues={repository.issues}
                  loading={loading}
                  repositoryOwner={repositoryOwner}
                  repositoryName={repositoryName}
                  issueState={issueState}
                  fetchMore={fetchMore}
                />
            );
          }}
        </Query>
      )}
    </div>
  );
}

const prefetchIssues = (
  client,
  repositoryOwner,
  repositoryName,
  issueState
) => {
  const nextIssueState = TRANSITION_STATE[issueState];
  if (isShow(nextIssueState)) {
    client.query({
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        issueState: nextIssueState,
      },
    });
  }
};

const IssueFilter = ({ 
  repositoryOwner,
  repositoryName,
  issueState, 
  onChangeIssueState 
}) => (
  <ApolloConsumer>
    {(client) => (
      <ButtonUnobtrusive
        onMouseOver={() => prefetchIssues(
          client,
          repositoryOwner,
          repositoryName,
          issueState,
        )}
        onClick={() =>
          onChangeIssueState(TRANSITION_STATE[issueState])
        }
      >
        {TRANSITION_LABELS[issueState]}
      </ButtonUnobtrusive>
    )}
  </ApolloConsumer>
);

const IssueList = ({ 
  issues,
  loading,
  repositoryOwner,
  repositoryName,
  issueState,
  fetchMore,
}) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem 
        key={node.id}
        issue={node}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
      />
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={issues.pageInfo.hasNextPage}
      fetchMore={fetchMore}
      variables={{
        cursor: issues.pageInfo.endCursor,
        repositoryOwner,
        repositoryName,
        issueState,
      }}
      updateQuery={updateQuery}
    >
      Issues
    </FetchMore>
  </div>
);


export default Issues;