import React from 'react'
import { Mutation } from 'react-apollo';
import { produce } from 'immer';

import REPOSITORY_FRAGMENT from '../fragments';
import Link from '../../Link';
import Button from '../../Button';

import '../style.css';

import {
  STAR_REPOSITORY,
  UNSTAR_REPOSITORY,
  WATCH_REPOSITORY
} from '../mutations';

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
}

const isWatch = viewerSubscription => viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateAddStar = (
  client, 
  { data: { addStar: { starrable: { id, viewerHasStarred } } } },
) => {
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: getUpdatedStarData(client, id, viewerHasStarred)
  });
};

const updateRemoveStar = (
  client,
  { data: { removeStar: { starrable: { id, viewerHasStarred } } } }
) => {
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: getUpdatedStarData(client, id, viewerHasStarred)
  });
};

const getUpdatedStarData = (client, id, viewerHasStarred) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount }  = repository.stargazers;
  totalCount = viewerHasStarred ? totalCount + 1 : totalCount - 1;

  return produce(repository, draft => {
    draft.stargazers.totalCount = totalCount;
  });
};

const updateWatch = (
  client,
  { data: { updateSubscription: { subscribable: { id, viewerSubscription } } } }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = repository.watchers;

  totalCount = viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
    ? totalCount + 1
    : totalCount - 1;

    client.writeFragment({
      id: `Repository:${id}`,
      fragment: REPOSITORY_FRAGMENT,
      data: produce(repository, draft => {
        draft.watchers.totalCount = totalCount;
      })
    });
};

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  viewerHasStarred,
  watchers,
  viewerSubscription
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        <Mutation 
          mutation={WATCH_REPOSITORY}
          variables={{
            id,
            viewerSubscription: isWatch(viewerSubscription) 
              ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED 
              : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
          }}
          optimisticResponse={{
            __typename: 'UpdateSubscriptionPayload',
            updateSubscription: {
              __typename: 'Mutation',
              subscribable: {
                __typename: 'Repository',
                id,
                viewerSubscription: isWatch(viewerSubscription)
                  ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                  : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
              },
            },
          }}
          update={updateWatch}
        >
          {(updateSubscription, {data, loading, error}) => (
            <Button
              className="RepositoryItem-title-action"
              data-test-id="updateSubscription"
              onClick={updateSubscription}>
                {watchers.totalCount}{' '}{isWatch(viewerSubscription) ? 'Unwatch' : 'Watch' }
            </Button>
          )}
        </Mutation>

        {!viewerHasStarred ? (
          <Mutation 
            mutation={STAR_REPOSITORY} 
            variables={{id}}
            optimisticResponse={{
              __typename: 'AddStarPayload',
              addStar: {
                __typename: 'Mutation',
                starrable: {
                  __typename: 'Repository',
                  id: id,
                  viewerHasStarred: true,
                },
              }
            }}
            update={updateAddStar}
          >
            {(addStar, {data, loading, error}) => (
              <Button 
                className="RepositoryItem-title-action" 
                onClick={addStar}>
                {stargazers.totalCount} Stars
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation 
            mutation={UNSTAR_REPOSITORY} 
            variables={{id}}
            optimisticResponse={{
              __typename: 'RemoveStarPayload',
              removeStar: {
                __typename: 'Mutation',
                starrable: {
                  __typename: 'Repository',
                  id: id,
                  viewerHasStarred: false,
                },
              }
            }}
            update={updateRemoveStar}
          >
            {(removeStar, {data, loading, error}) => (
              <Button className="RepositoryItem-title-action" onClick={removeStar}>
                {stargazers.totalCount} Stars
              </Button>
            )}
          </Mutation>
        )}
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {primaryLanguage && (
            <span>Language: {primaryLanguage.name}</span>
          )}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
)

export default RepositoryItem;