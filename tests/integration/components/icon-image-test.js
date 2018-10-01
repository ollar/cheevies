import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

moduleForComponent('icon-image', 'Integration | Component | icon image', {
    integration: true,
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    var image;

    run(() => {
        this.set('data', {
            name: 'test dev',
        });

        this.render(hbs`{{icon-image data=data}}`);

        assert.equal(
            this.$()
                .text()
                .trim(),
            'TD'
        );

        run(() => {
            image = {
                sm: {
                    url: 'image_url_sm',
                },
                md: {
                    url: 'image_url_md',
                },
                lg: {
                    url: 'image_url_lg',
                },
            };
            this.set('image', image);
            this.set('data', {
                name: 'test dev',
            });

            this.render(hbs`{{icon-image image=image data=data}}`);

            assert.ok(this.$('img').length);
            assert.equal(this.$('img').attr('src'), 'image_url_sm');
            assert.ok(this.$('.icon-image').hasClass('has-image'));
        });
    });
});
