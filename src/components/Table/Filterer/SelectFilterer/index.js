import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

export default function SelectFilterer({
  filter,
  onChange,
  options,
  defaultValue
}) {
  return (
    <Input
      type="select"
      onChange={(event) =>
        onChange(event.target.value === 'all' ? '' : event.target.value)
      }
      style={{ width: '100%' }}
      value={filter ? filter.value : defaultValue}
    >
      {options.map((item) => (
        <option key={item.key} value={item.value}>
          {item.name}
        </option>
      ))}
    </Input>
  );
}

SelectFilterer.propTypes = {
  filter: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object
  ]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      key: PropTypes.string
    })
  ),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
