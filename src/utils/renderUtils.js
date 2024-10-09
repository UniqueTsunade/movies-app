import React from "react";
import { Spin, Alert, Button } from "antd";

/* For CardsList.js*/

export function renderLoader(loading) {
  return loading ? <Spin fullscreen size="large" /> : null;
}

export function renderError(error, message) {
  return error ? (
    <Alert message="Error" description={message} type="error" />
  ) : null;
}

export function renderWarning(warningMessage, handleWarning) {
  return warningMessage ? (
    <Alert
      message="Info message"
      description={warningMessage}
      type="info"
      action={
        <Button
          size="small"
          type="primary"
          onClick={handleWarning} //Update movies on click
        >
          Try again
        </Button>
      }
    />
  ) : null;
}

export function renderRatedTabMessage(ratedTabMessage) {
  return ratedTabMessage ? <Alert message={ratedTabMessage} type="info" showIcon /> : null;
}

export function renderContent(loading, error, moviesList) {
  return !loading && !error && moviesList.length > 0 ? moviesList : null;
}