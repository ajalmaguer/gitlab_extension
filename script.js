// helpers
Array.prototype.unique = function(uniqueField) {
	var arr = []
	var uniqueObjects = {}

	for(var i = 0; i < this.length; i++) {
		uniqueObjects[this[i][uniqueField]] = this[i]
	}

	for (var key in uniqueObjects) {
		arr.push(uniqueObjects[key]);
	}

	return arr; 
}


// Links
function getLinkData() {
	var els = $('a[data-reference-type=issue]')
	
	var data = els.map((i, el) => {
		return {
			href: getLink(el),
			title: getTitle(el),
			issue: getIssue(el)
		}
	})
	return data.toArray().unique('issue')
}



function issueList(linkData) {
	return linkData.map(link => {
		return $(`
			<a class="gfm gfm-issue" href="${link.href}" target="_blank">
				<div class="row">
					<div class="col-xs-3">
							<strong>${link.issue}</strong>
					</div>
					<div class="col-xs-9">
						${link.title}
					</div>
				</div>
			</a>
		`)
	})
}

function getIssue(el) {
	return el.innerText
}

function getLink(el) {
	return el.href
}

function getTitle(el) {
	if (el.title) {
		return el.title	
	} else {
		return $(el).data()['original-title']
	}
}



// new section code

function addNewSection () {
	var sidebarElement = $('.issuable-sidebar')[0];
	var newSection = $(`
		<div id="referencedLinks">
			<style>
				.linkedIssueList .row {
					margin-bottom: 10px;
				}
			</style>
			<hr>
			<div class="time_tracker time-tracking-component-wrap">
				<div class="sidebar-collapsed-icon">
					<i class="fa fa-hashtag fa-fw"></i>
				</div>
				<div class="title hide-collapsed">
					Linked Issues
				</div>
				<div class="time-tracking-content hide-collapsed">
					<div class="time-tracking-no-tracking-pane linkedIssueList">
						<div class="sidebar-issue-link">
							
						</div>
					</div>
				</div>
			</div>
		</div>
	`)

	if ($('#referencedLinks').length == 0) {
		$(sidebarElement).append(newSection)
	}
}

function onRoute(regEx) {
	return window.location.pathname.split('/').last().match(regEx)
}

function renderIssues() {
	addNewSection()

	var linkData = getLinkData()
	var linkListTargetElement = $('.linkedIssueList')[0]
	$(linkListTargetElement).html(issueList(linkData))
}


function createFilterFocusKeyboardShortcut() {
	document.addEventListener('keydown', e => {
		if (e.code === 'KeyF' && e.shiftKey) {
			e.preventDefault()
			var filterElement = document.querySelector('input.filtered-search')
			if (filterElement) filterElement.focus()
		}
	})
}

function createOpenAllIssuesButton() {
	// place new button in nav controls
	const openIssuesButton = $('<button>', {class: 'btn btn-default', id: 'openIssuesButton'}).html('Open All Issues')[0];
	$(openIssuesButton).click(openAllIssuesInNewWindows)
	$('.nav-controls')[0].append(openIssuesButton);
}

function openAllIssuesInNewWindows() {
	const links = $('.issue-title-text a').toArray();
	links.forEach(function (link) {
		const href = link.href
		window.open(href , '_blank');
	})
}

// start features
if (onRoute(/(\d)+/)) renderIssues()
if (onRoute(/issues/) || onRoute(/boards/) ) createFilterFocusKeyboardShortcut()
if (onRoute(/issues/)) createOpenAllIssuesButton()
