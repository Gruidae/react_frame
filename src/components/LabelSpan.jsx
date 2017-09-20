import React from 'react';
import LabelPair from './LabelPair';
import FormatUtils from '../utils/FormatUtils';

function createMarkup(value) {
  return { __html: FormatUtils.parsePre(value) };
}

/* eslint-disable react/no-danger */
export default function LabelSpan(props) {
  return (
    <LabelPair {...props} >
      {<span className={props.className} dangerouslySetInnerHTML={createMarkup(props.value)} />}
    </LabelPair>
  );
}
