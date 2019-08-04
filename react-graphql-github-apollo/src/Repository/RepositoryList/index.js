import React, { Fragment } from 'react';
import produce from 'immer';

import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem';
import Issues from '../../Issue';

import '../style.css';

const getUpdateQuery = entry => (previousResult, {fetchMoreResult}) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  // immer boilerplate killer !
  return produce(previousResult, draft => {
    draft[entry].repositories.pageInfo = fetchMoreResult[entry].repositories.pageInfo;
    draft[entry].repositories.edges = [
      ...previousResult[entry].repositories.edges,
      ...fetchMoreResult[entry].repositories.edges
    ]
  });
}

const RepositoryList = ({ repositories, loading, fetchMore, entry }) => ( 
  <Fragment>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
        
        <Issues 
          repositoryName={node.name}
          repositoryOwner={node.owner.login}
        />
      </div>
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      fetchMore={fetchMore}
      variables={{
        cursor: repositories.pageInfo.endCursor
      }}
      updateQuery={getUpdateQuery(entry)}
    >
      Repositories
    </FetchMore>

  </Fragment>
);

export default RepositoryList;