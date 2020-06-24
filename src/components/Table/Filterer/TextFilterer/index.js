import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { isObject } from 'lodash';

export default function TextFilterer({ filter, onChange, convertString }) {
  return (
    <Input
      type="text"
      onChange={(event) => {
        const { value } = event.target;
        if (!value) {
          onChange(null);
        }
        else{
          onChange({
            value: convertString(value),
            $valueTmp: value
          });
        }
      }}
      style={{ width: '100%' }}
      value={isObject(filter) ? filter.$valueTmp : filter}
    />
  );
}

TextFilterer.propTypes = {
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  convertString: PropTypes.func
};
