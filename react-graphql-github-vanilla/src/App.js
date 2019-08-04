import React, { Component } from 'react';
import axios from 'axios';

import Organization from './Organization';

import './App.css';

const TITLE = 'React GraphQL GitHub client';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});

const ADD_STAR = `
  mutation ($repositoryId: ID!) {
    addStar(input: {
      starrableId: $repositoryId
    }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

const addStar = (repositoryId) => {
  return axiosGitHubGraphQL.post('', {
    query: ADD_STAR,
    variables: {repositoryId}
  });
}

const REMOVE_STAR = `
  mutation ($repositoryId: ID!) {
    removeStar(input: {
      starrableId: $repositoryId
    }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

const removeStar = (repositoryId) => {
  return axiosGitHubGraphQL.post('', {
    query: REMOVE_STAR,
    variables: {repositoryId}
  });
}

const GET_ISSUES_OF_REPOSITORY = `
  query ($organization: String!, $repository: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        id
        name
        url
        stargazers {
          totalCount
        }
        viewerHasStarred
        issues(first: 5, after: $cursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }`;

const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split('/');

  return axiosGitHubGraphQL.post('', {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: {organization, repository, cursor}
  });
}

const resolveIssuesQuery = (queryResult, cursor) => state => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    if (data) {
      return {
        organization: data.organization,
        errors,
      };
    }

    return {
      errors,
    };
  }

  const { edges: oldIssues } = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues,
        },
      },
    },
    errors,
  };
};

const resolveAddStarMutation = (mutationResult) => state => {
  const {viewerHasStarred} = mutationResult.data.data.addStar.starrable;

  const { totalCount } = state.organization.repository.stargazers;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred: viewerHasStarred,
        stargazers: {
          totalCount: totalCount + 1
        }
      }
    }
  };
};

const resolveRemoveStarMutation = (mutationResult) => state => {
  const {viewerHasStarred} = mutationResult.data.data.removeStar.starrable;

  const { totalCount } = state.organization.repository.stargazers;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred: viewerHasStarred,
        stargazers: {
          totalCount: totalCount - 1
        }
      }
    }
  };
};

class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  }

  componentDidMount() {
    this.onFetchFromGitHub(this.state.path);
  }

  onChange = (event) => {
    this.setState({path: event.target.value});
  }

  onSubmit = (event) => {
    this.onFetchFromGitHub(this.state.path);
    event.preventDefault();
  }

  onFetchMoreIssues = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;

    this.onFetchFromGitHub(this.state.path, endCursor);
  }

  onFetchFromGitHub = (path, cursor) => {
    getIssuesOfRepository(path, cursor)
      .then(result => this.setState(resolveIssuesQuery(result, cursor)));
  }

  onStarRepository = (repositoryId, viewerHasStarred) => {
    if (viewerHasStarred) {
      removeStar(repositoryId)
        .then(result => this.setState(resolveRemoveStarMutation(result)));
    } else {
      addStar(repositoryId)
        .then(result => this.setState(resolveAddStarMutation(result)));
    }
  }

  render() {
    const {path, organization, errors} = this.state;

    return (
      <div>
        <h1>{TITLE}</h1>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">Show open issues for https://github.com/</label>
          <input id="url"
            type="text"
            onChange={this.onChange}
            value={path}
            style={{width: '300px'}}>
          </input>
          <button type="submit">Search</button>
        </form>

        <hr/>
        {(organization || errors) ? (
          <Organization organization={organization}
              errors={errors}
              onFetchMoreIssues={this.onFetchMoreIssues}
              onStarRepository={this.onStarRepository}/>
        ) : (
          <p>No information yet ...</p>
        )}
      </div>
    );
  }
}

export default App;
