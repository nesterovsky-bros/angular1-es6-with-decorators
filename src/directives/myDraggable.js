import { Directive, Inject, HostListener, BindThis } from "../angular-decorators";

@Directive("myDraggable")
export class MyDraggable
{
  @Inject() $document;
  @Inject() $element;


  startX = 0;
  startY = 0;
  x = 0;
  y = 0;

  @HostListener() mousedown(event)
  {
    // Prevent default dragging of selected content
    event.preventDefault();
    this.startX = event.pageX - this.x;
    this.startY = event.pageY - this.y;
    this.$document.on('mousemove', this.mousemove);
    this.$document.on('mouseup', this.mouseup);
  }

  @BindThis() mousemove(event)
  {
    this.y = event.pageY - this.startY;
    this.x = event.pageX - this.startX;
    this.$element.css({
      top: this.y + 'px',
      left: this.x + 'px'
    });
  }

  @BindThis() mouseup()
  {
    this.$document.off('mousemove', this.mousemove);
    this.$document.off('mouseup', this.mouseup);
  }

  $onInit()
  {
    this.$element.css(
    {
      position: 'relative',
      border: '1px solid red',
      backgroundColor: 'lightgrey',
      cursor: 'pointer'
    });
  }
}
