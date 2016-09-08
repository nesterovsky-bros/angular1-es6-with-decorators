import { Directive, Inject, Input, BindThis } from "../angular-decorators";

@Directive("myCurrentTime")
export class MyCurrentTime
{
  @Inject() $interval;
  @Inject() dateFilter;
  @Inject() $element;
  @Input() myCurrentTime;
  timeoutId;

  @BindThis() updateTime()
  {
    this.$element.text(this.dateFilter(new Date(), this.myCurrentTime));
  }

  $onInit()
  {
    this.timeoutId = this.$interval(this.updateTime, 1000);
  }

  $onDestroy()
  {
    this.$interval.cancel(this.timeoutId);
  }

  $onChanges(changes)
  {
    this.updateTime();
  }
}
