import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceSpaceWithHyphen'
})

export class ReplaceSpaceWithHyphen implements PipeTransform {
    transform(value: string): any {
        return value.replace(/\s+/g, '-'); // replace tags
    }
}