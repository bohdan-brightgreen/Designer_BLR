// direct = center = even spacing between lights & walls (double between grid)
// indirect = wall-huggimg
app.RoomTypes = {};

/**
 * Residential room types
 */
app.RoomTypes.Residential = {

	'Kitchen (working area)': {
		recommended_lux: 160,
		light_layout: 'direct'
	},

	'Toilet': {
		recommended_lux: 80,
		light_layout: 'direct'
	},

	'Dining/Living (general)': {
		recommended_lux: 100,
		light_layout: 'indirect'
	},

	'Dining (dining table)': {
		recommended_lux: 200,
		light_layout: 'direct'
	},

	'Laundry': {
		recommended_lux: 300,
		light_layout: 'direct'
	},

	'W.I.R': {
		recommended_lux: 300,
		light_layout: 'direct'
	},

	'Bathroom': {
		recommended_lux: 150,
		light_layout: 'direct'
	},

	'Bathroom (vanity basin)': {
		recommended_lux: 500,
		light_layout: 'direct'
	},

	'Bedroom': {
		recommended_lux: 150,
		light_layout: 'indirect'
	},

	'Bedroom (special)': {
		recommended_lux: 500,
		light_layout: 'indirect'
	},

	'Study (desk)': {
		recommended_lux: 400,
		light_layout: 'direct'
	},

	'Entertainment': {
		recommended_lux: 240,
		light_layout: 'indirect'
	},

	'Garage (general)': {
		recommended_lux: 160,
		light_layout: 'direct',
		recommended_wattage_sqm: 3
	},

	'Garage (repair bench)': {
		recommended_lux: 400,
		light_layout: 'direct',
		recommended_wattage_sqm: 3
	},

	'Patio': {
		recommended_lux: 160,
		light_layout: 'indirect'
	},

	'Hallway': {
		recommended_lux: 40,
		light_layout: 'direct'
	},

	'Stairway': {
		recommended_lux: 80,
		light_layout: 'direct'
	},

	'Foyer': {
		recommended_lux: 160,
		light_layout: 'direct'
	},

	'Other (Day Time Use)': {
		recommended_lux: 40,
		light_layout: 'indirect'
	},

	'Other (Night Time Use)': {
		recommended_lux: 80,
		light_layout: 'indirect'
	},

    'Roof': {
        recommended_lux: 0,
        light_layout: 'direct'
    }
};

/**
 * Commercial room types
 */

app.RoomTypes.Commercial = {

	'Retail (general)': {
		recommended_lux: 160,
		light_layout: 'direct'
	},

	'Kitchen General': {
		recommended_lux: 160,
		light_layout: 'direct'
	},

	'Kitchen working bench': {
		recommended_lux: 240,
		light_layout: 'direct'
	},

	'Toilet': {
		recommended_lux: 80,
		light_layout: 'direct'
	},

	'Entrance': {
		recommended_lux: 160,
		light_layout: 'indirect'
	},

	'Waiting Room': {
		recommended_lux: 160,
		light_layout: 'indirect'
	},

	'Enquiry Desk': {
		recommended_lux: 320,
		light_layout: 'indirect'
	},

	'Corridor': {
		recommended_lux: 40,
		light_layout: 'indirect'
	},

	'Stairs': {
		recommended_lux: 80,
		light_layout: 'direct'
	},

	'Lift, esalator, moving walk': {
		recommended_lux: 160,
		light_layout: 'direct'
	},

	'Carpark (indoor)': {
		recommended_lux: 40,
		light_layout: 'direct'
	},

	'Inspection (rough work)': {
		recommended_lux: 160,
		light_layout: 'indirect'
	},

	'Inspection (fine work)': {
		recommended_lux: 600,
		light_layout: 'direct'
	},

	'Art Gallery, Museum': {
		recommended_lux: 150,
		light_layout: 'direct'
	},

	'Art Gallery, Museum (special)': {
		recommended_lux: 300,
		light_layout: 'direct'
	},

	'Concert Platform': {
		recommended_lux: 80,
		light_layout: 'direct'
	},

	'Booking office (on desk)': {
		recommended_lux: 400,
		light_layout: 'direct'
	},

	'Cinema Foyer': {
		recommended_lux: 80,
		light_layout: 'indirect'
	},

	'Projection room': {
		recommended_lux: 160,
		light_layout: 'indirect'
	},

	'School Assembly hall (general)': {
		recommended_lux: 80,
		light_layout: 'direct'
	},

	'School Assembly hall (exam)': {
		recommended_lux: 140,
		light_layout: 'indirect'
	},

	'Classroom': {
		recommended_lux: 240,
		light_layout: 'direct'
	},

	'Laboratory': {
		recommended_lux: 400,
		light_layout: 'direct'
	},

	'Library (general)': {
		recommended_lux: 240,
		light_layout: 'direct'
	},

	'Library (desks)': {
		recommended_lux: 400,
		light_layout: 'direct'
	},

	'Transport terminal (counter desk)': {
		recommended_lux: 400,
		light_layout: 'direct'
	},

	'Transport terminal (hall)': {
		recommended_lux: 400,
		light_layout: 'direct'
	},

	'Computer Room (general)': {
		recommended_lux: 320,
		light_layout: 'direct'
	},

	'Conference Room': {
		recommended_lux: 240,
		light_layout: 'indirect'
	},

	'Office counter': {
		recommended_lux: 320,
		light_layout: 'direct'
	},

	'Office desk': {
		recommended_lux: 320,
		light_layout: 'direct'
	},

	'Hospital (Patient Transit area)': {
		recommended_lux: 240,
		light_layout: 'indirect'
	},

	'Hospital Ward (General)': {
		recommended_lux: 240,
		light_layout: 'direct'
	},

	'Hospital Ward (examination)': {
		recommended_lux: 400,
		light_layout: 'direct'
	},

	'Medical Centre (waiting room)': {
		recommended_lux: 160,
		light_layout: 'indirect'
	},

	'Medical Centre (Dental chair / Special examiation)': {
		recommended_lux: 600,
		light_layout: 'direct'
	},

	'Other (Day Time Use)': {
		recommended_lux: 40,
		light_layout: 'indirect'
	},

	'Other (Night Time Use)': {
		recommended_lux: 80,
		light_layout: 'indirect'
	},

    'Roof': {
        recommended_lux: 0,
        light_layout: 'direct'
    }
};
