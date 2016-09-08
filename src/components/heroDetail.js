import { Component, Input, Output } from "../angular-decorators";
import template from "../templates/heroDetail.html";

@Component("heroDetail", { template })
export class HeroDetail
{
  @Input() hero;
  @Output() onDelete;
  @Output() onUpdate;

  delete()
  {
    this.onDelete({ hero: this.hero });
  };

  update(prop, value)
  {
    this.onUpdate({ hero: this.hero, prop, value });
  };
}
