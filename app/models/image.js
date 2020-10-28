import Model, { attr } from '@ember-data/model';

export default Model.extend({
    url: attr('string'),
    fullPath: attr('string'),

    type: attr('string'),
    name: attr('string'),
    size: attr('number'),
    height: attr('number'),
    width: attr('number'),

    created: attr('number'),
});
