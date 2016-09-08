import { Component } from "../angular-decorators";
import template from "../templates/heroList.html";

@Component("heroList", { template })
export class HeroList
{
  // This would be loaded by $http etc.
  list =
  [
    { name: "Superman", location: "" },
    { name: "Batman", location: "Wayne Manor" }
  ];

  updateHero(hero, prop, value)
  {
    hero[prop] = value;
  };

  deleteHero(hero)
  {
    var idx = this.list.indexOf(hero);

    if (idx >= 0)
    {
      this.list.splice(idx, 1);
    }
  };
}
