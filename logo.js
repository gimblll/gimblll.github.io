
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Mouse tracking 
var mouse_x = -1;
var mouse_y = -1;

function track_mouse(evt)
{
    mouse_x = evt.clientX - canvas.offsetLeft + window.pageXOffset;
    mouse_y = evt.clientY - canvas.offsetTop  + window.pageYOffset;
}

canvas.addEventListener('mousemove', track_mouse, false);

// Logo "art"
var items = 
[
	"xxxx x x   x xxx  x   x   x  ",
	"x    x xx xx x  x x   x   x  ",
	"x xx x x x x xxx  x   x   x  ",
	"x  x x x   x x  x x   x   x  ",
	"xxxx x x   x xxx  xxx xxx xxx",
];

const square_size = 16;
const full_text_w = items[0].length * square_size;
const full_text_h = items.length * square_size;

// Generate one block sprite
var block_bm_id = context.createImageData(square_size, square_size);
var pixel_array = block_bm_id.data;

for (var i = 0; i < square_size*square_size*4; i += 4)
{
	pixel_array[i + 0] = 110;
	pixel_array[i + 1] = 110;
	pixel_array[i + 2] = 110;
	pixel_array[i + 3] = 255;
}

// Convert given data to Image (for rendering speed, don't know why it's faster)
function convert_to_image(image_data)
{
    var canvas = document.createElement("canvas");
	var c = canvas.getContext("2d");
	c.putImageData(image_data, 0, 0);
	
	var img = new Image();
	img.src = canvas.toDataURL("image/png");
	return img;
}

var block_image = convert_to_image(block_bm_id)

// Utility functions
function random_in_range(min, max)
{
	return min + Math.random() * (max - min);
}
function random_index(length)
{
	return Math.min(length - 1, Math.round(Math.random() * length))
}
function sign(val)
{
	return val >= 0 ? 1 : -1;
}

// Generate location data for squares
var target_location = [];  
var offset = []
var order = [];

for (var y = 0; y < items.length; ++y)
{
	var line = items[y];
	for (var x = 0; x < line.length; ++x) 
	{
		if (line[x] == "x")
		{
			// Home location
			target_location.push([ 
				x * square_size, 
				y * square_size ]); 
			
			// Starting offset
			var offset_x = 0;
			var offset_y = 0;
			
			if (Math.random() > 0.5)
				offset_x = canvas.width;
			else
				offset_y = canvas.height;
			
			var sign = Math.random() > 0.5 ? 1 : -1;
			offset_x *= sign;
			offset_y *= sign;
			
			offset.push([ offset_x, offset_y ]);
			
			// Index of part
			order.push(offset.length - 1);
		}
	}
}

// Randomize order of the squares (the order they animate in)
for (var i = 0; i < order.length; ++i)
{
	var rand_idx = random_index(order.length);
	var tmp = order[rand_idx];
	order[rand_idx] = order[i];
	order[i] = tmp;
}

var loop_time = 0;

const anim_time_in = 0.7;
const anim_block_interval = 0.01;
const anim_speed = 3.0;
const anim_strength = 6.0;
const anim_x_distance = 10;

function sign(val)
{
	return val >= 0 ? 1 : -1;
}

function lerp(from, to, amount)
{
	return from + (to - from) * amount;
}

function clamp(val, min, max)
{
	if (val < min) return min;
	if (val > max) return max;
	return val;
}

// Animation loop
var loop_game = function(delta_t)
{
    // Clear screen
    context.clearRect(0, 0, canvas.width, canvas.height);
	
	loop_time += delta_t;
	
	const x_offset_centered = (canvas.width - full_text_w) * 0.5 + Math.sin(loop_time) * anim_x_distance;
	const y_offset_centered = (canvas.height - full_text_h) * 0.5;

	// Draw the rectangles
	for (var i = 0; i < target_location.length; ++i)   
	{
		// Slide the rectangles into their places
		var target_delay = order[i] * anim_block_interval;
		var phase_linear = loop_time > target_delay ? clamp((loop_time - target_delay) / anim_time_in, 0.0, 1.0) : 0.0;
		var phase = phase_linear * phase_linear * phase_linear;
		
		var x_offset = (1.0 - phase) * offset[i][0] + x_offset_centered;
		var y_offset = (1.0 - phase) * offset[i][1] + y_offset_centered;
		
		var x = target_location[i][0] + x_offset;
		var y = target_location[i][1] + y_offset;

		y += Math.cos(x * 0.01 + loop_time * anim_speed) * anim_strength;

		// Warp the position based on mouse
		if (mouse_x >= 0)
		{
			var center_x = x + square_size * 0.5;
			var center_y = y + square_size * 0.5;
			
			var dist_x = mouse_x - center_x;
			var dist_y = mouse_y - center_y;
			
			var distance_to_mouse = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
			
			var dir_x = dist_x / distance_to_mouse;
			var dir_y = dist_y / distance_to_mouse;
		
			x += dir_x * 20;
			y += dir_y * 20;
		}
		
		x = Math.round(x);
		y = Math.round(y);
		
		context.drawImage(block_image, x, y);
	}
}

// Master looping construct
var fps = 0;
var last_time = (new Date).getTime();
var loop_active = false;

var master_loop = function()
{	
	if (loop_active)
		return;
	
	loop_active = true;
	
	// Calculate FPS
	var curr_time = (new Date).getTime();
	fps = Math.round(1000 / (curr_time - last_time));
	last_time = curr_time;
	
	// Update main loop
	loop_game(1/60);

	// Draw FPS
/*	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.font = "10pt Calibri";
	context.fillText("FPS: " + fps, 10, 30);	
*/
	loop_active = false;
}  

// Start running the loop
setInterval(master_loop, 1000 / 60);
