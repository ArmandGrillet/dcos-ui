import React from "react";

import Icon from "../components/Icon";

class ComponentsPage extends React.Component {
  render() {
    return this.props.children;
  }
}

ComponentsPage.routeConfig = {
  label: formatMessage({ id: "XXXX", defaultMessage: "Components" }),
  icon: <Icon id="components-inverse" size="small" family="product" />,
  matches: /^\/components/
};

module.exports = ComponentsPage;
