import React from "react";
import PropTypes from "prop-types";

const Label = ({ commonInputProps }) => {
  const { label } = commonInputProps;

  return <div>{label}</div>;
};

Label.displayName = "Label";

Label.propTypes = {
  commonInputProps: {
    label: PropTypes.string
  }
};

export default Label;
