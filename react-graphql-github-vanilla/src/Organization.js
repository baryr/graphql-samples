import React from 'react';

import Repository from './Repository';

const Organization = ({organization, errors, onFetchMoreIssues, onStarRepository}) => {
  if (errors) {
    return (
      <p>
        <strong>something went wrong!</strong>
        {errors.map(error => error.message).join(' ')}
      </p>
    );
  }
  return (
    <div>
      <p>
        <strong>Issues for the organization: </strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository repository={organization.repository} onFetchMoreIssues={onFetchMoreIssues} onStarRepository={onStarRepository}/>
    </div>
  )
};

export default Organization;
