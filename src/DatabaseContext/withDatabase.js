import * as React from "react";
import { DatabaseContext } from "./database-context";
export function withDb(Component) {
  return function DbComponent(props) {
    return (
      <DatabaseContext.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </DatabaseContext.Consumer>
    );
  };
}
