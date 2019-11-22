// This file is part of Indico.
// Copyright (C) 2002 - 2019 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import editableDetailsURL from 'indico-url:event_editing.api_editable';

import React, {useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {Loader} from 'semantic-ui-react';

import TimelineHeader from 'indico/modules/events/reviewing/components/TimelineHeader';
import TimelineContent from 'indico/modules/events/reviewing/components/TimelineContent';
import {indicoAxios, handleAxiosError} from 'indico/utils/axios';
import {camelizeKeys} from 'indico/utils/case';

import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';
import TimelineItem from './TimelineItem';

export default function Timeline({eventId, contributionId, type}) {
  const [{details, isLoading}, dispatch] = useReducer(reducer, {
    details: null,
    isLoading: false,
  });

  useEffect(() => {
    (async () => {
      dispatch(actions.setLoading(true));
      try {
        const {data} = await indicoAxios.get(
          editableDetailsURL({confId: eventId, contrib_id: contributionId, type})
        );
        dispatch(actions.setDetails(camelizeKeys(data)));
      } catch (error) {
        handleAxiosError(error, false, true);
      } finally {
        dispatch(actions.setLoading(false));
      }
    })();
  }, [contributionId, eventId, type]);

  if (isLoading) {
    return <Loader active />;
  } else if (!details) {
    return null;
  }

  const lastRevision = details.revisions[details.revisions.length - 1];
  const revisions = selectors.processRevisions(details.revisions);
  const state =
    lastRevision.finalState.name === 'none' ? lastRevision.initialState : lastRevision.finalState;

  return (
    <>
      <TimelineHeader
        contribution={details.contribution}
        state={state}
        submitter={revisions[0].submitter}
        eventId={eventId}
      >
        STUFF
      </TimelineHeader>
      <TimelineContent revisions={revisions} state={state} itemComponent={TimelineItem} />
    </>
  );
}

Timeline.propTypes = {
  eventId: PropTypes.number.isRequired,
  contributionId: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};