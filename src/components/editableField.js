import { Component, Attribute, Input, Output, Optional } from "../angular-decorators";
import template from "../templates/editableField.html";

@Component("editableField", { template })
export class EditableField
{
  @Input() fieldValue;
  @Optional() @Attribute() fieldType;
  @Output() onUpdate;

  editMode = false;
  fieldValueCopy;

  $onInit()
  {
    // Make a copy of the initial value to be able to reset it later
    this.fieldValueCopy = this.fieldValue;

    // Set a default fieldType
    if (!this.fieldType)
    {
      this.fieldType = 'text';
    }
  }

  handleModeChange()
  {
    if (this.editMode)
    {
      this.onUpdate({ value: this.fieldValue });
      this.fieldValueCopy = this.fieldValue;
    }

    this.editMode = !this.editMode;
  };

  reset()
  {
    this.fieldValue = this.fieldValueCopy;
  };
}
