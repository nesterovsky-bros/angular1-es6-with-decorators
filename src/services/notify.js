import { Inject, Injectable } from "../angular-decorators";

@Injectable("notifier")
export class NotifierService
{
  @Inject() $window;

  msgs = [];

  notify(msg)
  {
    this.msgs.push(msg);

    if (this.msgs.length === 3)
    {
      this.$window.alert(this.msgs.join('\n'));
      this.msgs = [];
    }
  }
}
