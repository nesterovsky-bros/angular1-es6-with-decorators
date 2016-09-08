import { Inject, Controller } from "../angular-decorators";
import { NotifierService } from "../services/notify";
import { ReverseFilter } from "../filters/reverse";

@Controller("MyController")
export class MyController
{
  $onInit()
  {
    this.filteredGreeting = this.reverseFilter(this.greeting);
  }

  @Inject(NotifierService) notifier;
  greetMe = "World";

  callNotify(msg) { this.notifier.notify(msg); }

  @Inject(ReverseFilter) reverseFilter;
  greeting = 'hello';

  format = 'M/d/yy h:mm:ss a';
}
