import PropTypes from "prop-types";
import React from "react";

import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";
import ValidatorUtil from "#SRC/js/utils/ValidatorUtil";
import EmptyStates from "#SRC/js/constants/EmptyStates";

/**
 * Render a boolean value as a <ConfigurationMapValue>, with it's values being
 * selected from an `options` array.
 */
class ConfigurationMapBooleanValue extends React.Component {
  render() {
    let { defaultValue, options, value } = this.props;

    // Bail early with default if empty
    if (ValidatorUtil.isEmpty(value)) {
      return <ConfigurationMapValue>{defaultValue}</ConfigurationMapValue>;
    }

    // Pick the appropriate value representation
    if (value) {
      value = options.truthy;
    } else {
      value = options.falsy;
    }

    return (
      <ConfigurationMapValue>
        {value}
      </ConfigurationMapValue>
    );
  }
}

ConfigurationMapBooleanValue.defaultProps = {
  defaultValue: <em>{EmptyStates.CONFIG_VALUE}</em>,
  options: {
    truthy: "Enabled",
    falsy: "Disabled"
  },
  value: null
};

ConfigurationMapBooleanValue.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  options: PropTypes.shape({
    truthy: PropTypes.any,
    falsy: PropTypes.any
  }),
  value: PropTypes.any
};

module.exports = ConfigurationMapBooleanValue;
