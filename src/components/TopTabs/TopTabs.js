import React, { Component } from "react";

import { Tabs } from "antd"; 

export default class TopTabs extends Component {
    items = [
        {
          key: '1',
          label: 'Search',
        },
        {
          key: '2',
          label: 'Rated',
        },
      ];

      onChange = (key) => {
        this.props.handleTabChange(key);
      };

    render() {
        return (
          <Tabs defaultActiveKey="1" items={this.items} onChange={this.onChange} />
        )
    }

}