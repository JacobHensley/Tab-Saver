const currentTabs = document.getElementById('Current-Tabs');
const savedLists = document.getElementById('Saved-Lists');
var entries = [];

var lists = new Map(JSON.parse(localStorage.getItem('savedLists')));
if (lists === null)
{
	lists = new Map();
} 
else
{
	DisplayLists();
}

function DisplayLists()
{
	for (let [name, entries] of lists) 
	{
		const listCard = document.createElement('div');
		listCard.setAttribute('class', 'list-card');
		savedLists.appendChild(listCard);

		const listInput = document.createElement('div');
		listInput.setAttribute('class', 'list-input');
		listCard.appendChild(listInput);

		var setName = document.createElement("p");
		setName.setAttribute('class', 'set-title');
		setName.innerHTML = name;
		listInput.appendChild(setName);

		var setOpen = document.createElement("input");
		setOpen.type = "button";
		setOpen.value = "Open";
		setOpen.onclick = function() 
		{
			for (const tab of entries) 
			{
				chrome.tabs.create({ url: tab.url });
			}
		};
		listInput.appendChild(setOpen);

		var setRemove = document.createElement("input");
		setRemove.type = "button";
		setRemove.value = "Remove";
		setRemove.onclick = function() 
		{
			lists.delete(name);
			localStorage.setItem('savedLists', JSON.stringify(Array.from(lists.entries())));
			listCard.remove();
		};
		listInput.appendChild(setRemove);

		const list = document.createElement('div');
		list.setAttribute('class', 'set');
		listCard.appendChild(list);

		for (const tab of entries) 
		{
			const entry = document.createElement('div');
			entry.setAttribute('class', 'entry');
			list.appendChild(entry);

			const icon = document.createElement('img');
			if (tab.favIconUrl)
				icon.src = tab.favIconUrl;
			else
				icon.src = "missing icon.png";
			icon.style.width = '16px';
			icon.style.height = '16px';
			entry.appendChild(icon);

			var title = document.createElement("p");
			title.innerHTML = tab.title;
			entry.appendChild(title);
		}
	}
}

//Addes entry to html and to entries list
function AddEntry(tab) 
{
	const entry = document.createElement('div');
	entry.setAttribute('class', 'entry');
	currentTabs.appendChild(entry);

	const icon = document.createElement('img');
	if (tab.favIconUrl)
		icon.src = tab.favIconUrl;
	else
		icon.src = "missing icon.png";
	icon.style.width = '16px';
	icon.style.height = '16px';
	entry.appendChild(icon);

	var title = document.createElement("p");
	title.innerHTML = tab.title;
	entry.appendChild(title);

	entries.push(tab);
}

//Saves current entries list into a map with inputed name
function SaveEntries() 
{
	var name = document.getElementById("Input-Title").value;
	lists.set(name, entries)
	localStorage.setItem('savedLists', JSON.stringify(Array.from(lists.entries())));

	var myobj = document.getElementById("Saved-Lists");
	myobj.innerHTML = ''
	DisplayLists();
}

//Detects when save button is presses
document.getElementById('Save-Button').onclick = function() 
{
	SaveEntries();
};

//Adds all current tabs to entry list
chrome.windows.getCurrent({populate:true},function(window)
{
	window.tabs.forEach(function(tab)
	{
		if (!tab.url.includes("chrome://"))
		{
			AddEntry(tab);
		}
	});
});