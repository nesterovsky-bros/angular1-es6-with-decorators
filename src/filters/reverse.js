import { Pipe } from "../angular-decorators";

@Pipe("reverse")
export class ReverseFilter
{
  transform(input, uppercase)
  {
    input = input || '';

    var out = '';

    for(var i = 0; i < input.length; i++)
    {
      out = input.charAt(i) + out;
    }

    // conditional based on optional argument
    if (uppercase)
    {
      out = out.toUpperCase();
    }

    return out;
  }
}
