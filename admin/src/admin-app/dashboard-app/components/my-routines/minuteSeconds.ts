  import { Pipe } from '@angular/core';

  @Pipe({
    name: 'minuteSeconds'
  })
  export class MinuteSecondsPipe {
  
    transform(value: number) {
    //  console.log('value ', value)
      const minutes: number = Math.floor(value / 60);
      var seconds = Math.floor(value % 60);
      var hours = value/60
      if(hours >=1 ) {
        return hours + ':' + minutes + ':' + seconds;
      }
      // const min = (value - minutes * 60)
      // const cmins = '00'.slice(min.toString().length)+min;
      // console.log('seconds value ', (value - minutes * 60))
      return minutes + ':' + seconds;
      // return minutes.toString().padStart(2, '0') + ':' + (value - minutes * 60).toString().padStart(2, '0');
   }

}