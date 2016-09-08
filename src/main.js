import { angular, modules, Module } from "./angular-decorators";
import { MyController } from "./controllers/myController";
import { HeroList } from "./components/heroList";
import { HeroDetail } from "./components/heroDetail";
import { EditableField } from "./components/editableField";
import { NotifierService } from "./services/notify";
import { MyTabs } from "./components/myTabs";
import { MyPane } from "./components/myPane";
import { ReverseFilter } from "./filters/reverse";
import { MyCurrentTime } from "./directives/myCurrentTime";
import { MyDraggable } from "./directives/myDraggable";

@Module(
  "my-app",
  [
    MyController,
    NotifierService,
    HeroList,
    HeroDetail,
    EditableField,
    MyTabs,
    MyPane,
    ReverseFilter,
    MyCurrentTime,
    MyDraggable
  ])
class MyApp { }

angular.bootstrap(document, modules(MyApp));
