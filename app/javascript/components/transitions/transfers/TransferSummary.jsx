import React from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import { useI18n } from "../../i18n";
import TransitionStatus from "../TransitionStatus";

const TransferSummary = ({ transition, classes }) => {
  const i18n = useI18n();
  const transitionStatus = transition.status ? (
    <Grid item md={2} xs={10}>
      <TransitionStatus status={transition.status} />
    </Grid>
  ) : null;

  return (
    <Grid container spacing={2}>
      <Grid item md={10} xs={10}>
        <div className={classes.wrapper}>
          <div className={classes.titleHeader}>
            {i18n.t("transition.type.transfer")}
          </div>

          {/* TODO: The date should be localized */}
          <div className={classes.date}>
            {format(new Date(transition.created_at), "MMM dd,yyyy")}
          </div>
        </div>
      </Grid>
      {transitionStatus}
    </Grid>
  );
};

TransferSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  transition: PropTypes.object.isRequired
};

export default TransferSummary;