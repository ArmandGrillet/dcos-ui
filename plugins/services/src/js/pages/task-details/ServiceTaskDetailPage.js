import React from "react";

import MesosStateStore from "#SRC/js/stores/MesosStateStore";
import Page from "#SRC/js/components/Page";

import TaskDetail from "./TaskDetail";
import ServiceBreadcrumbs from "../../components/ServiceBreadcrumbs";

const dontScrollRoutes = [/\/files\/view.*$/, /\/logs.*$/];

class ServiceTaskDetailPage extends React.Component {
  render() {
    const { location, params, routes } = this.props;
    const { id, taskID } = params;

    const routePrefix = `/services/detail/${encodeURIComponent(id)}/tasks/${encodeURIComponent(taskID)}`;
    const tabs = [
      {
        label: formatMessage({ id: "XXXX", defaultMessage: "Details" }),
        routePath: routePrefix + "/details"
      },
      {
        label: formatMessage({ id: "XXXX", defaultMessage: "Files" }),
        routePath: routePrefix + "/files"
      },
      {
        label: formatMessage({ id: "XXXX", defaultMessage: "Logs" }),
        routePath: routePrefix + "/logs"
      }
    ];

    const task = MesosStateStore.getTaskFromTaskID(taskID);
    let breadcrumbs;
    if (task != null) {
      breadcrumbs = (
        <ServiceBreadcrumbs
          serviceID={id}
          taskID={task.getId()}
          taskName={task.getName()}
        />
      );
    } else {
      breadcrumbs = <ServiceBreadcrumbs serviceID={id} />;
    }

    const dontScroll = dontScrollRoutes.some(regex => {
      return regex.test(location.pathname);
    });

    return (
      <Page dontScroll={dontScroll}>
        <Page.Header breadcrumbs={breadcrumbs} tabs={tabs} iconID="services" />
        <TaskDetail params={params} routes={routes}>
          {this.props.children}
        </TaskDetail>
      </Page>
    );
  }
}

ServiceTaskDetailPage.propTypes = {
  params: React.PropTypes.object,
  routes: React.PropTypes.array
};

module.exports = ServiceTaskDetailPage;
