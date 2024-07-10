function create_header(current_page)
{
	function add_menu_item(is_active, title, url)
	{
  	let html = "<div class='col-4 col-lg-2 col-sm-3 gbl-title-menu'>";

  	if (is_active)
  		html += `<i>${title}</i>`;
  	else
  		html += `<a href='${url}'>${title}</a>`;

  	html += "</div>";

  	return html;
 	}

  let header = create_node(document.body, "div");

	header.innerHTML = `
	<div class="container-xxl pt-5">
	  <div class="row">
	 	  <p class="col gbl-title">Kimmo Lahtinen / gimblll</p>
   	</div>

	  <div class="row justify-content-center px-4 pb-2">
	
 		${add_menu_item(current_page == 0, "WORK", "index.html")}
 		${add_menu_item(current_page == 1, "ABOUT", "about.html")}

  	 	<div class="col-4 col-lg-2 col-sm-3 gbl-title-menu">
			  <div class="row justify-content-center">
		  	 	<div class="col-2"><a href="mailto:gimblll@gmail.com"><i class="bi-envelope gbl-title-icon"></i></a></div>
		  	 	<div class="col-2"><a href="https://twitter.com/gimblll" target="_blank" rel="noopener noreferrer"><i class="bi-twitter gbl-title-icon"></i></a></div>
		  	 	<div class="col-2"><a rel="me" href="https://mastodon.gamedev.place/@gimblll" target="_blank" rel="noopener noreferrer"><i class="bi-mastodon gbl-title-icon"></i></a></div>
		  	 	<div class="col-2"><a rel="me" href="https://www.youtube.com/@gimblll" target="_blank" rel="noopener noreferrer"><i class="bi-youtube gbl-title-icon"></i></a></div>
		  	 	<div class="col-2"><a href="https://fi.linkedin.com/in/kimmo-lahtinen-908612111" target="_blank" rel="noopener noreferrer"><i class="bi-linkedin gbl-title-icon"></i></a></div>
		  	 	<div class="col-2"><a href="https://discord.gg/bhMDFyBEpV" target="_blank" rel="noopener noreferrer"><i class="bi-discord gbl-title-icon"></i></a></div>
		 	 	</div>
   		</div>
  	</div>
  </div>
  `;
}

function create_footer()
{
  let x = document.createElement("div");
  x.innerHTML = "<div class='row'><a href='#'' class='back-to-top align-items-center justify-content-center'>Back to the top!</a><p/></div>";
  document.body.appendChild(x);
}

function create_node(parent, type, class_name) 
{
  let x = document.createElement(type);
  if (class_name)
	  x.className = class_name;
  parent.appendChild(x);
  return x;
}

function create_text(parent, text, url)
{
	let link_text = document.createTextNode(text);
	if (url)
	{
		let link = create_node(parent, "a", "");
		link.href = url;
		link.appendChild(link_text);
	}
	else
		parent.appendChild(link_text);
}

function create_image(parent, image_url, class_name)
{
	let i = create_node(parent, "img", class_name);
	i.src = image_url;
}

function create_card(project_title, gif_id, project_url, year, platforms_html, description_html)
{
	let root = document.getElementById("card_container_indie");

	// Create the entry
	let card = create_node(root, "div", "col-sm-6 col-lg-4");

	// Add title image
	let img = create_node(card, "img", "img-fluid");
	img.src = gif_id;

	// Texts
	let project = create_node(card, "div", "project-card");
	let title = create_node(project, "div", "project-title");

	create_text(title, project_title, project_url);

	if (year)
	{
		create_text(title, " (" + year + ")");
	}

	let platform_root = create_node(project, "p", "project-desc");
	platform_root.innerHTML = platforms_html;

	let desc_root = create_node(project, "p", "project-desc");
	desc_root.innerHTML = description_html; 
}
