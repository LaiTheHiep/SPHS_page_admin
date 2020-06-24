/* eslint-disable no-invalid-this */
import React, { Component } from 'react';
import { Col, Row, Input } from 'reactstrap';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import PropTypes from 'prop-types';
import moment from 'moment';
import './style.css';
export default class DateRangerFilterer extends Component {
  static propTypes = {
    filter: PropTypes.object,
    onChange: PropTypes.func
  }

  state = {
    startDate: null,
    endDate: null,
    focusedInput: null
  }

  render() {
    return (
      <DateRangePicker
        startDateId="startDate"
        endDateId="endDate"
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        onDatesChange={this._onDatesChange}
        focusedInput={this.state.focusedInput}
        onFocusChange={this._onFocusChange}
        isOutsideRange={() => false}
        minimumNights={0}
        displayFormat="DD-MM-YYYY"
        showClearDates
        withPortal
        small
      />
    );
  }

  _onDatesChange = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate });
    if (!startDate && !endDate) {
      this.props.onChange(null);

      return;
    }
    const tmp = {};
    if (startDate) {
      tmp.$gte = moment(startDate).toDate()
        .toString()
        .replace('12:00:00', '00:00:00');
    }
    if (endDate) {
      tmp.$lte = moment(endDate).toDate()
        .toString()
        .replace('12:00:00', '23:59:59');
    }
    this.props.onChange({ value: tmp });
  }

  _onFocusChange = (focusedInput) => this.setState({ focusedInput })
}
