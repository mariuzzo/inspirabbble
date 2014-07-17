/**
 * The dialog view.
 */

'use strict';

define([
    'views/overlay',
    'hbs!templates/dialog',
    'utils/animationend',
    'jquery',
    'underscore',
    'backbone'
], function(Overlay, template, animationend, $, _, Backbone) {

    var Dialog = Backbone.View.extend({

        el: 'body',

        /**
         * The template of the dialog view.
         */
        template: template,

        /**
         * The events related to the dialog view.
         */
        events: {
            'click .dialog-close': 'hide'
        },

        /**
         * The reference of the template rendered and attached into the DOM.
         */
        view: null,

        /**
         * The reference of content wrapper inside the dialog.
         */
        content: $(),

        data: {

            /**
             * The title of the dialog.
             */
            title: null,

            /**
             * The HTML content to rendered inside the dialog.
             */
            content: null,

            /**
             * The options to pass to the dialog.
             */
            options: {
                /**
                 * Indicate if the close button will be available.
                 */
                close: true
            }
        },

        /**
         * Initialize the dialog view.
         */
        initialize: function(data) {
            this.el = $(this.el);
            this.data = _.extend(this.data, data);
            this.render();
            this.listenTo(this.overlay, 'click', this.hide);
        },

        /**
         * Render the dialog once into the DOM.
         */
        render: function() {
            this.overlay = new Overlay();
            // Check if the dialog was already rendered.
            if (this.el.has(this.view).length === 0) {
                // Render the template.
                this.view = $(this.template(this.data));
                // The dialog should be hidden by default.
                this.view.hide();
                // Append the rendered view into the DOM.
                this.el.append(this.view);
                // Save a reference to the content.
                this.content = this.view.find('.dialog-content');
            }
        },

        /**
         * Show the dialog.
         */
        show: function() {
            if (!this.isHidden()) {
                return; // Nothing to do here.
            }
            this.overlay.show();
            this.view.removeClass('hidden').show();
            this.delegateEvents();
        },

        /**
         * Hide the dialog.
         */
        hide: function() {
            // Check if already hidden.
            if (this.isHidden()) {
                return; // Nothing to do here.
            }
            
            // Hide the overlay & dialog.
            this.overlay.hide();
            this.view.one(animationend, function() {
                this.view.hide();
            }.bind(this));
            this.view.addClass('hidden');

            // Undelegate and trigger event.
            this.undelegateEvents();
            this.trigger('hide');
        },

        /**
         * Indicate if the the dialog is hidden.
         */
        isHidden: function() {
            return this.view.is('.hidden, :hidden');
        }

    });

    return Dialog;

});