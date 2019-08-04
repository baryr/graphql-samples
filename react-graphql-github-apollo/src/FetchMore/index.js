import React from 'react';

import Loading from '../Loading';
import { ButtonUnobtrusive } from '../Button';

import './style.css';

const FetchMore = ({
  fetchMore,
  hasNextPage,
  variables,
  updateQuery,
  loading,
  children
}) => (
  <div className="FetchMore">
    {loading ? (
      <Loading/>
    ) : (
      hasNextPage && (
        <ButtonUnobtrusive
          className="FetchMore-button"
          onClick={() => fetchMore({ variables, updateQuery })
        }>
            More {children}
        </ButtonUnobtrusive>
      )
    )}
  </div>
);

export default FetchMore;