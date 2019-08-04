import React from 'react';

const Repository = ({repository, onFetchMoreIssues, onStarRepository}) => {
  if (!repository) {
    return (
      <div>
        <p>
          <strong>No such repository! </strong>
        </p>
      </div>
    );
  }
  return (
    <div>
      <p>
        <strong>In Repository: </strong>
        <a href={repository.url}>{repository.name}</a>
      </p>

      <button onClick={() => onStarRepository(repository.id, repository.viewerHasStarred)}>
        {repository.stargazers.totalCount} - {repository.viewerHasStarred ? 'Unstar' : 'Star'}
      </button>

      <ul>
        {repository.issues.edges.map(issue => {
          return (
            <li key={issue.node.id}>
              <a href={issue.node.url}>{issue.node.title}</a>
              <ul>
                {issue.node.reactions.edges.map(reaction => (
                  <li key={reaction.node.id}>{reaction.node.content}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <hr/>

      {repository.issues.pageInfo.hasNextPage && (
        <button onClick={onFetchMoreIssues}>Fetch more issues</button>
      )}
    </div>
  )
};

export default Repository;
