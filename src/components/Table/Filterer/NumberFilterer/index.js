import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

export default function NumberFilterer({ filter, onChange }) {
  return (
    <Input
      type="number"
      onChange={(event) => {
        const { value } = event.target;
        onChange(value);
      }}
      style={{ width: '100%' }}
      value={filter && filter.value}
    />
  );
}

NumberFilterer.propTypes = {
  filter: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string
};
