/**
 *	Class app.LightColours
 * Represents a collection of colour palate for lights.
 *
 */
app.lightColours = {
    collection: [
        '#ffb400', '#f6511d', '#00a6ed', '#7fb800', '#0d2c54',
        '#610345', '#107e7d', '#044b7f', '#95190c', '#f95738',
        '#f4d35e', '#e83f6f', '#2274a5', '#f8f991', '#444b6e',
        '#e71d36', '#2ec4b6', '#ff4e00', '#8ea604', '#fe938c',
        '#50514f', '#ead2ac', '#ffe066', '#f0c808', '#2ab7ca',
        '#7e7f9a', '#725752', '#f39237', '#ff006e', '#19381f'
    ],

    lights: {},

    getLightColour: function(code)
    {
        if (!this.lights.hasOwnProperty(code)) {
            return this.setLightColour(code);
        }

        return this.lights[code];
    },

    setLightColour: function(code, colour)
    {
        var availableColours = this.getAvailableColours();
        if (colour === undefined) {
            colour = (availableColours.length > 0) ? availableColours[0] : this.addColourToCollection();

        } else if (availableColours.indexOf(colour) === -1) {
            colour = this.getLightColour(code);
        }

        this.lights[code] = colour;

        return colour;
    },

    removeUnusedLights: function()
    {
        var allLights = {};

        $.each(app.designer.rooms, function(r, room) {
            $.each(room.lights, function(l, light) {
                allLights[light.code] = 1;
            });
        });

        for (var i in this.lights) {
            if (this.lights.hasOwnProperty(i) && !allLights.hasOwnProperty(i)) {
                delete this.lights[i];
            }
        }
    },

    getAvailableColours: function()
    {
        var availableColours = _.clone(this.collection);

        for (var i in this.lights) {
            if (this.lights.hasOwnProperty(i)) {
                var index = availableColours.indexOf(this.lights[i]);
                if (index > -1) {
                    availableColours.splice(index, 1);
                }
            }
        }

        return availableColours;
    },

    addColourToCollection: function(colour)
    {
        if (colour === undefined) {
            colour = this.generateRandomColour();
        }

        while (this.collection.indexOf(colour) > -1) {
            colour = this.generateRandomColour();
        }

        this.collection.push(colour);

        return colour;
    },

    generateRandomColour: function()
    {
        return '#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1, 6);
    }
};