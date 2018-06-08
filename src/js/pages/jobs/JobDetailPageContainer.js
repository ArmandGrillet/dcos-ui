import { StoreMixin } from "mesosphere-shared-reactjs";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import { routerShape } from "react-router";
import mixin from "reactjs-mixin";
import gql from "graphql-tag";
import { graphqlObservable, componentFromStream } from "data-service";

import Loader from "../../components/Loader";
import Page from "../../components/Page";
import RequestErrorMsg from "../../components/RequestErrorMsg";
import JobsBreadcrumbs from "../../components/breadcrumbs/JobsBreadcrumbs";
import MetronomeStore from "../../stores/MetronomeStore";
import JobDetailPage from "./JobDetailPage";
import schema from "./JobModel";

export const DIALOGS = {
  EDIT: "edit",
  DESTROY: "destroy"
};

const LoadingScreen = function({ jobTree }) {
  return (
    <Page>
      <Page.Header breadcrumbs={<JobsBreadcrumbs tree={jobTree} />} />
      <Loader />
    </Page>
  );
};

const ErrorScreen = function({ jobTree }) {
  return (
    <Page>
      <Page.Header breadcrumbs={<JobsBreadcrumbs tree={jobTree} />} />
      <RequestErrorMsg />
    </Page>
  );
};

const getInput = id =>
  graphqlObservable(
    gql`
query {
  metronomeItem(id: "${id}") {
    id
    name
  }
}
`,
    schema,
    {}
  );

const JobDetailPageMediator = componentFromStream($props => {
  const id$ = $props.map(props => props.params.id).distinctUntilChanged();
  const jobs$ = id$
    .switchMap(id => getInput(id).do(res => console.log("res", res)))
    .map(({ data: { metronomeItem } }) => metronomeItem);

  return jobs$
    .combineLatest($props)
    .map(([job, props]) => ({ ...props, job }))
    .do(data => console.info("mediator:", data))
    .map(props => {
      if (!props.job) {
        return <LoadingScreen jobTree={null} />;
      }

      return <JobDetailPageContainer {...props} />;
    });
});

export class JobDetailPageContainer extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: "metronome",
        events: [
          "jobDeleteSuccess",
          "jobDeleteError",
          "jobDetailChange",
          "jobDetailError",
          "jobRunError",
          "jobRunSuccess",
          "jobScheduleUpdateError",
          "jobScheduleUpdateSuccess"
        ],
        suppressUpdate: false
      }
    ];
    this.state = {
      errorMsg: null,
      errorCount: 0,
      isJobFormModalOpen: false,
      isLoading: true,
      disabledDialog: null,
      jobActionDialog: null
    };

    [
      "onMetronomeStoreJobDeleteError",
      "onMetronomeStoreJobDeleteSuccess",
      "onMetronomeStoreJobDetailError",
      "onMetronomeStoreJobDetailChange",
      "handleRunNowButtonClick",
      "handleDisableScheduleButtonClick",
      "handleEnableScheduleButtonClick",
      "handleAcceptDestroyDialog",
      "closeDialog",
      "handleEditButtonClick",
      "handleDestroyButtonClick"
    ].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  closeDialog() {
    this.setState({
      disabledDialog: null,
      jobActionDialog: null
    });
  }

  handleEditButtonClick() {
    this.setState({ jobActionDialog: DIALOGS.EDIT });
  }

  handleDestroyButtonClick() {
    this.setState({ jobActionDialog: DIALOGS.DESTROY });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    MetronomeStore.monitorJobDetail(this.props.params.id);
  }

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    MetronomeStore.stopJobDetailMonitor(this.props.params.id);
  }

  handleRunNowButtonClick() {
    const job = MetronomeStore.getJob(this.props.params.id);

    MetronomeStore.runJob(job.getId());
  }

  handleDisableScheduleButtonClick() {
    MetronomeStore.toggleSchedule(this.props.params.id, false);
  }

  handleEnableScheduleButtonClick() {
    MetronomeStore.toggleSchedule(this.props.params.id, true);
  }

  handleAcceptDestroyDialog(stopCurrentJobRuns = false) {
    MetronomeStore.deleteJob(this.props.params.id, stopCurrentJobRuns);
  }

  onMetronomeStoreJobDeleteError(id, error) {
    const { message: errorMsg } = error;
    if (id !== this.props.params.id || errorMsg == null) {
      return;
    }

    this.setState({
      jobActionDialog: DIALOGS.DESTROY,
      errorMsg
    });
  }

  onMetronomeStoreJobDeleteSuccess() {
    // TODO: remove the closeDialog here.
    this.closeDialog();
    this.context.router.push("/jobs");
  }

  onMetronomeStoreJobDetailError() {
    this.setState({ errorCount: this.state.errorCount + 1 });
  }

  onMetronomeStoreJobDetailChange() {
    this.setState({ errorCount: 0, isLoading: false });
  }

  render() {
    const jobTree = MetronomeStore.jobTree;
    if (this.state.errorCount > 3) {
      return <ErrorScreen jobTree={jobTree} />;
    }

    if (this.state.isLoading) {
      return <LoadingScreen jobTree={jobTree} />;
    }

    // const job = MetronomeStore.getJob(this.props.params.id);
    const props = {
      handleEditButtonClick: this.handleEditButtonClick,
      handleRunNowButtonClick: this.handleRunNowButtonClick,
      handleDisableScheduleButtonClick: this.handleDisableScheduleButtonClick,
      handleEnableScheduleButtonClick: this.handleEnableScheduleButtonClick,
      handleDestroyButtonClick: this.handleDestroyButtonClick,
      handleAcceptDestroyDialog: this.handleAcceptDestroyDialog,
      closeDialog: this.closeDialog,
      jobTree,
      // job,
      errorMsg: this.state.errorMsg,
      disabledDialog: this.state.disabledDialog,
      jobActionDialog: this.state.jobActionDialog
    };

    console.log("JDPC", this.props);

    return <JobDetailPage {...this.props} {...props} />;
  }
}
JobDetailPageContainer.contextTypes = {
  router: routerShape
};

export default JobDetailPageMediator;