import DS from 'ember-data';

export default DS.Model.extend({
    group_id: DS.attr('string'),
    queryParams: DS.attr(),
});
