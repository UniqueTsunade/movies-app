import React, { Component } from "react";

import { Tabs } from "antd"; 

export default class TopTabs extends Component {
    items = [
        {
          key: '1',
          label: 'Search',
          children: 'Content of Tab Pane 1',
        },
        {
          key: '2',
          label: 'Rated',
          children: 'Content of Tab Pane 2',
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