import { Component } from "../angular-decorators";
import template from "../templates/my-tabs.html";

@Component("myTabs", { template, transclude: true })
export class MyTabs
{
  panes = [];

  select(pane)
  {
    this.panes.forEach(function(pane) { pane.selected = false; });
    pane.selected = true;
  }

  addPane(pane)
  {
    if (this.panes.length === 0)
    {
      this.select(pane);
    }

    this.panes.push(pane);
  }
}
