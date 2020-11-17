import Model, { attr } from '@ember-data/model';

export default Model.extend({
    group_id: attr('string'),
    queryParams: attr(),
});
