import { Component, Attribute, SkipSelf } from "../angular-decorators";
import { MyTabs } from "./myTabs";
import template from "../templates/my-pane.html";

@Component("myPane", { template, transclude: true })
export class MyPane
{
  @SkipSelf(MyTabs) tabsCtrl;
  @Attribute() title;

  $onInit()
  {
    this.tabsCtrl.addPane(this);
    console.log(this);
  };
}
