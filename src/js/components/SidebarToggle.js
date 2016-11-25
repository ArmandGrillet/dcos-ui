import React from 'react';

import EventTypes from '../constants/EventTypes';
import Icon from '../components/Icon';
import InternalStorageMixin from '../mixins/InternalStorageMixin';
import SidebarActions from '../events/SidebarActions';
import SidebarStore from '../stores/SidebarStore';

function getSidebarState() {
  return {
    isDocked: SidebarStore.get('isDocked'),
    isVisible: SidebarStore.get('isVisible')
  };
}

var SidebarToggle = React.createClass({

  displayName: 'SidebarToggle',

  mixins: [InternalStorageMixin],

  componentWillMount() {
    this.internalStorage_set(getSidebarState());
  },

  componentDidMount() {
    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSidebarStateChange
    );
  },

  componentWillUnmount() {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSidebarStateChange
    );
  },

  onSidebarStateChange() {
    this.internalStorage_set(getSidebarState());
    this.forceUpdate();
  },

  onClick(e) {
    var data = this.internalStorage_get();

    e.preventDefault();
    e.stopPropagation();

    if (data.isVisible) {
      SidebarActions.close();
    } else {
      SidebarActions.open();
    }
  },

  render() {
    return (
      <div className="page-navigation-sidebar-toggle" onClick={this.onClick}>
        <Icon className="page-navigation-sidebar-toggle-icon"
          id="menu"
          family="mini"
          size="mini"
          color="grey" />
        <span className="page-navigation-sidebar-toggle-label">
          Show/Hide Sidebar
        </span>
      </div>
    );
  }
});

module.exports = SidebarToggle;
